import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Star, 
  GitFork, 
  Eye, 
  Calendar, 
  File, 
  Folder, 
  FolderOpen,
  Search,
  Download,
  Code,
  FileText,
  Image,
  Archive,
  ChevronRight,
  ChevronDown,
  Home
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRepositories } from '@/hooks/useRepositories';
import apiService from '@/services/api';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface FileItem {
  name: string;
  path: string;
  type: 'file' | 'dir';
  size?: number;
  sha?: string;
  url?: string;
}

interface RepositoryData {
  name: string;
  full_name: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  html_url: string;
  created_at: string;
  updated_at: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  default_branch: string;
}

export const RepositoryDetail: React.FC = () => {
  const { repoName } = useParams<{ repoName: string }>();
  const navigate = useNavigate();
  const { repositories } = useRepositories();
  
  const [repository, setRepository] = useState<RepositoryData | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [loadingFile, setLoadingFile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FileItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPath, setCurrentPath] = useState<string[]>([]);

  // Find repository from the list
  useEffect(() => {
    if (repositories.length > 0 && repoName) {
      const foundRepo = repositories.find(repo => repo.name === repoName);
      if (foundRepo) {
        setRepository(foundRepo as any);
        loadRepositoryFiles(repoName);
      }
    }
  }, [repositories, repoName]);

  const loadRepositoryFiles = async (repo: string) => {
    try {
      setLoading(true);
      const response = await apiService.getRepositoryContents(repo, '');
      if (response.data) {
        const githubFiles = response.data.map((item: any) => ({
          name: item.name,
          path: item.path,
          type: item.type,
          size: item.size,
          sha: item.sha,
          url: item.url,
        }));
        setFiles(githubFiles);
      }
    } catch (error) {
      console.error('Failed to load repository files:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFileContent = async (repo: string, filePath: string) => {
    setLoadingFile(true);
    try {
      const response = await apiService.getFileContent(repo, filePath);
      if (response.data) {
        setFileContent(response.data.content);
      }
    } catch (error) {
      console.error('Failed to load file content:', error);
      setFileContent('Failed to load file content');
    } finally {
      setLoadingFile(false);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query: string, repo: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      try {
        setIsSearching(true);
        const response = await apiService.searchRepositoryFiles(repo, query);
        if (response.data) {
          const searchFiles = response.data.map((item: any) => ({
            name: item.name,
            path: item.path,
            type: item.type || 'file',
            size: item.size,
            sha: item.sha,
            url: item.url,
          }));
          setSearchResults(searchFiles);
        }
      } catch (error) {
        console.error('Search failed:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300),
    []
  );

  // Debounce utility function
  function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  // Handle search query changes
  useEffect(() => {
    if (searchQuery && repository) {
      debouncedSearch(searchQuery, repository.name);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchQuery, repository, debouncedSearch]);

  const toggleFolder = (folderPath: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderPath)) {
      newExpanded.delete(folderPath);
    } else {
      newExpanded.add(folderPath);
    }
    setExpandedFolders(newExpanded);
  };

  const getFileIcon = (fileName: string, type: string) => {
    if (type === 'dir') {
      return expandedFolders.has(fileName) ? FolderOpen : Folder;
    }
    
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'tsx':
      case 'ts':
      case 'js':
      case 'jsx':
        return Code;
      case 'md':
      case 'txt':
        return FileText;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'svg':
        return Image;
      case 'zip':
      case 'tar':
      case 'gz':
        return Archive;
      default:
        return File;
    }
  };

  const filteredFiles = useMemo(() => {
    if (searchQuery.trim()) {
      return searchResults;
    }
    return files;
  }, [searchQuery, searchResults, files]);

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getLanguageFromFileName = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const languageMap: { [key: string]: string } = {
      'js': 'javascript',
      'jsx': 'jsx',
      'ts': 'typescript',
      'tsx': 'tsx',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'cs': 'csharp',
      'php': 'php',
      'rb': 'ruby',
      'go': 'go',
      'rs': 'rust',
      'swift': 'swift',
      'kt': 'kotlin',
      'scala': 'scala',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'sass': 'sass',
      'less': 'less',
      'json': 'json',
      'xml': 'xml',
      'yaml': 'yaml',
      'yml': 'yaml',
      'md': 'markdown',
      'sql': 'sql',
      'sh': 'bash',
      'bash': 'bash',
      'zsh': 'bash',
      'fish': 'bash',
      'dockerfile': 'dockerfile',
      'docker': 'dockerfile',
      'vue': 'vue',
      'svelte': 'svelte',
      'r': 'r',
      'm': 'objectivec',
      'mm': 'objectivec',
      'pl': 'perl',
      'lua': 'lua',
      'dart': 'dart',
      'elm': 'elm',
      'ex': 'elixir',
      'exs': 'elixir',
      'hs': 'haskell',
      'ml': 'ocaml',
      'fs': 'fsharp',
      'fsx': 'fsharp',
      'clj': 'clojure',
      'cljs': 'clojure',
      'edn': 'clojure',
      'jl': 'julia',
      'nim': 'nim',
      'cr': 'crystal',
      'd': 'd',
      'pas': 'pascal',
      'pp': 'pascal',
      'ada': 'ada',
      'adb': 'ada',
      'ads': 'ada',
      'asm': 'assembly',
      's': 'assembly',
      'tex': 'latex',
      'rtex': 'latex',
      'sty': 'latex',
      'cls': 'latex',
      'log': 'text',
      'txt': 'text',
      'cfg': 'ini',
      'ini': 'ini',
      'conf': 'ini',
      'toml': 'toml',
      'env': 'bash',
      'gitignore': 'text',
      'gitattributes': 'text',
      'editorconfig': 'ini',
      'eslintrc': 'json',
      'prettierrc': 'json',
      'babelrc': 'json',
      'tsconfig': 'json',
      'package': 'json',
      'lock': 'text',
    };
    return languageMap[extension || ''] || 'text';
  };

  const isBinaryFile = (fileName: string): boolean => {
    const binaryExtensions = [
      'png', 'jpg', 'jpeg', 'gif', 'svg', 'ico', 'webp', 'bmp', 'tiff',
      'mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv',
      'mp3', 'wav', 'flac', 'aac', 'ogg', 'wma',
      'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
      'zip', 'rar', '7z', 'tar', 'gz', 'bz2',
      'exe', 'dll', 'so', 'dylib', 'bin',
      'woff', 'woff2', 'ttf', 'otf', 'eot',
      'ico', 'cur', 'ani'
    ];
    const extension = fileName.split('.').pop()?.toLowerCase();
    return binaryExtensions.includes(extension || '');
  };

  if (!repository) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Repository not found</h1>
          <Button onClick={() => navigate('/repositories')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Repositories
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 mb-4">
          <Button onClick={() => navigate('/repositories')} variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{repository.name}</h1>
            <p className="text-muted-foreground">{repository.description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href={repository.html_url} target="_blank" rel="noopener noreferrer">
                <Eye className="h-4 w-4 mr-2" />
                View on GitHub
              </a>
            </Button>
          </div>
        </div>

        {/* Repository Stats */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4" />
            {repository.stargazers_count}
          </div>
          <div className="flex items-center gap-1">
            <GitFork className="h-4 w-4" />
            {repository.forks_count}
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {repository.watchers_count}
          </div>
          {repository.language && (
            <Badge variant="secondary">{repository.language}</Badge>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Updated {new Date(repository.updated_at).toLocaleDateString()}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* File Explorer */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="flex-shrink-0">
              <div className="flex items-center gap-2">
                <Folder className="h-5 w-5" />
                <CardTitle>Files</CardTitle>
              </div>
              
              {/* Enhanced Breadcrumb Navigation */}
              {currentPath.length > 0 && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2 p-2 bg-muted/30 rounded-lg border border-border/50">
                  <button
                    onClick={() => setCurrentPath([])}
                    className="flex items-center gap-1 hover:text-foreground hover:bg-muted/50 px-2 py-1 rounded transition-colors"
                    title="Go to repository root"
                  >
                    <Home className="h-3 w-3" />
                    <span>🏠 Root</span>
                  </button>
                  {currentPath.map((segment, index) => (
                    <React.Fragment key={index}>
                      <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
                      <button
                        onClick={() => setCurrentPath(currentPath.slice(0, index + 1))}
                        className="hover:text-foreground hover:bg-muted/50 px-2 py-1 rounded transition-colors truncate max-w-24"
                        title={`Go to ${segment}`}
                      >
                        📁 {segment}
                      </button>
                    </React.Fragment>
                  ))}
                  <div className="ml-auto text-xs text-muted-foreground/60">
                    {currentPath.length} level{currentPath.length > 1 ? 's' : ''} deep
                  </div>
                </div>
              )}
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto space-y-1 pr-2">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="text-sm text-muted-foreground">Loading repository files...</p>
                  </div>
                ) : (
                  filteredFiles.map((file) => {
                    const Icon = getFileIcon(file.name, file.type);
                    const isExpanded = expandedFolders.has(file.path);
                    
                    return (
                      <div 
                        key={file.path} 
                        className="flex items-center justify-between p-2 rounded hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => {
                          if (file.type === 'file') {
                            setSelectedFile(file);
                            if (repository) {
                              loadFileContent(repository.name, file.path);
                            }
                          } else {
                            toggleFolder(file.path);
                          }
                        }}
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {file.type === 'dir' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFolder(file.path);
                              }}
                              className="p-0.5 hover:bg-muted rounded"
                            >
                              {isExpanded ? (
                                <ChevronDown className="h-3 w-3" />
                              ) : (
                                <ChevronRight className="h-3 w-3" />
                              )}
                            </button>
                          )}
                          <Icon className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate text-sm">{file.name}</span>
                        </div>
                        {file.type === 'file' && (
                          <span className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* File Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {selectedFile ? (
                    <>
                      <File className="h-5 w-5" />
                      <CardTitle>{selectedFile.name}</CardTitle>
                    </>
                  ) : (
                    <>
                      <FileText className="h-5 w-5" />
                      <CardTitle>Select a file to view</CardTitle>
                    </>
                  )}
                </div>
                {selectedFile && (
                  <Button variant="outline" size="sm" asChild>
                    <a 
                      href={`${repository.html_url}/blob/main/${selectedFile.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      View on GitHub
                    </a>
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto">
                {selectedFile ? (
                  <div className="h-full">
                    {isBinaryFile(selectedFile.name) ? (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        <div className="text-center">
                          <Image className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p className="mb-2">Binary file detected</p>
                          <p className="text-sm mb-4">{selectedFile.name}</p>
                          <Button variant="outline" size="sm" asChild>
                            <a 
                              href={`${repository.html_url}/blob/main/${selectedFile.path}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              View on GitHub
                            </a>
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full">
                        <div className="flex items-center justify-between mb-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <span>Language: {getLanguageFromFileName(selectedFile.name)}</span>
                            <span>Size: {formatFileSize(selectedFile.size)}</span>
                          </div>
                        </div>
                        
                        <div className="h-[calc(100%-2rem)] overflow-auto">
                          {loadingFile ? (
                            <div className="flex flex-col items-center justify-center h-full space-y-4">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                              <p className="text-sm text-muted-foreground">Loading file content...</p>
                            </div>
                          ) : (
                            <SyntaxHighlighter
                              language={getLanguageFromFileName(selectedFile.name)}
                              style={vscDarkPlus}
                              customStyle={{
                                margin: 0,
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem',
                                lineHeight: '1.5',
                              }}
                              showLineNumbers
                              wrapLines
                              wrapLongLines
                            >
                              {fileContent}
                            </SyntaxHighlighter>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <File className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Click on a file to view its contents</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
