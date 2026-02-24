import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import './repo.css'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'

export default function RepoNav() {
    const { language } = useLanguage()
    const navigate = useNavigate()
    const location = useLocation()
    const projeto = location?.state || null

    const labels = {
        back: { pt: 'Voltar', en: 'Back' },
        openOnGitHub: { pt: 'Abrir no GitHub', en: 'Open on GitHub' },
        noDescription: { pt: 'Sem descrição.', en: 'No description.' },
        root: { pt: 'Raiz', en: 'Root' },
        loadingStructure: { pt: 'Carregando estrutura...', en: 'Loading structure...' },
        emptyStructure: { pt: 'Estrutura vazia ou não disponível.', en: 'Empty or unavailable structure.' },
        loadingFile: { pt: 'Carregando arquivo...', en: 'Loading file...' },
        noFileSelected: { pt: 'Nenhum arquivo selecionado.', en: 'No file selected.' },
        loadingReadme: { pt: 'Carregando README...', en: 'Loading README...' },
        noReadme: { pt: 'Nenhum README disponível.', en: 'No README available.' },
        readmeHeader: { pt: 'README.md', en: 'README.md' }
    }

    const [treeEntries, setTreeEntries] = useState([])
    const [nested, setNested] = useState([])
    const [currentFolder, setCurrentFolder] = useState('')
    const [selectedPath, setSelectedPath] = useState('')
    const [fileContent, setFileContent] = useState(null)
    const [readmeContent, setReadmeContent] = useState(null)
    const [loadingReadme, setLoadingReadme] = useState(false)
    const [loadingTree, setLoadingTree] = useState(false)
    const [loadingFile, setLoadingFile] = useState(false)

    useEffect(() => {
        if (!projeto) return
        async function loadTree() {
            setLoadingTree(true)
            try {
                const owner = projeto.owner || projeto.repoOwner || projeto.owner_login || projeto.owner_login
                const repo = projeto.repoName || projeto.name
                const branch = projeto.default_branch || projeto.branch || 'main'
                const branchRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/branches/${branch}`)
                const branchJson = await branchRes.json()
                const treeSha = branchJson?.commit?.commit?.tree?.sha
                if (!treeSha) {
                    setTreeEntries([])
                    setNested([])
                    return
                }
                const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${treeSha}?recursive=1`)
                const treeJson = await treeRes.json()
                const entries = Array.isArray(treeJson.tree) ? treeJson.tree : []
                setTreeEntries(entries)
                setNested(buildTree(entries))
            } catch (err) {
                console.error('Erro ao carregar árvore', err)
                setTreeEntries([])
                setNested([])
            } finally {
                setLoadingTree(false)
            }
        }
        loadTree()
    }, [projeto])

    function buildTree(entries) {
        const root = []
        const map = {}
        entries.forEach(entry => {
            const parts = entry.path.split('/')
            let currentList = root
            let currentPath = ''
            parts.forEach((part, idx) => {
                currentPath = currentPath ? `${currentPath}/${part}` : part
                if (!map[currentPath]) {
                    const isLeaf = idx === parts.length - 1
                    const node = { name: part, path: currentPath, type: isLeaf ? entry.type : 'tree', children: [] }
                    map[currentPath] = node
                    if (idx === 0) currentList.push(node)
                    else {
                        const parentPath = currentPath.split('/').slice(0, -1).join('/')
                        if (map[parentPath]) map[parentPath].children.push(node)
                    }
                }
                currentList = map[currentPath].children
            })
        })
        return root
    }

    function getNodesAtPath(nestedRoot, path) {
        if (!path) return nestedRoot || []
        const parts = path.split('/')
        let nodes = nestedRoot || []
        for (const part of parts) {
            const found = nodes.find(n => n.name === part && n.type === 'tree')
            if (!found) return []
            nodes = found.children
        }
        return nodes
    }

    async function openFile(path) {
        if (!projeto) return
        setLoadingFile(true)
        setSelectedPath(path)
        setFileContent(null)
        try {
            const owner = projeto.owner || projeto.repoOwner || projeto.owner_login
            const repo = projeto.repoName || projeto.name
            const branch = projeto.default_branch || projeto.branch || 'main'
            const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`)
            const json = await res.json()
            if (json && json.content && json.encoding === 'base64') {
                // Decodifica base64 preservando UTF-8 (acentos)
                try {
                    const b64 = json.content.replace(/\n/g, '')
                    const binary = atob(b64)
                    const bytes = Uint8Array.from(binary.split('').map(c => c.charCodeAt(0)))
                    const decoder = new TextDecoder('utf-8')
                    setFileContent(decoder.decode(bytes))
                } catch (e) {
                    // Fallback para navegadores antigos
                    setFileContent(decodeURIComponent(escape(atob(json.content.replace(/\n/g, '')))))
                }
            } else {
                setFileContent(null)
            }
        } catch (err) {
            console.error('Erro ao abrir arquivo', err)
            setFileContent(null)
        } finally {
            setLoadingFile(false)
        }
    }

    function decodeBase64ToText(b64) {
        try {
            const cleaned = b64.replace(/\n/g, '')
            const binary = atob(cleaned)
            const bytes = Uint8Array.from(binary.split('').map(c => c.charCodeAt(0)))
            const decoder = new TextDecoder('utf-8')
            return decoder.decode(bytes)
        } catch (e) {
            try {
                return decodeURIComponent(escape(atob(b64.replace(/\n/g, ''))))
            } catch (err) {
                return null
            }
        }
    }

    useEffect(() => {
        if (!projeto) return
        async function loadReadme() {
            setLoadingReadme(true)
            try {
                const owner = projeto.owner || projeto.repoOwner || projeto.owner_login
                const repo = projeto.repoName || projeto.name
                const branch = projeto.default_branch || projeto.branch || 'main'
                const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme?ref=${branch}`)
                const json = await res.json()
                if (json && json.content && json.encoding === 'base64') {
                    const text = decodeBase64ToText(json.content)
                    setReadmeContent(text)
                } else {
                    setReadmeContent(projeto.readme || null)
                }
            } catch (err) {
                console.error('Erro ao carregar README', err)
                setReadmeContent(projeto.readme || null)
            } finally {
                setLoadingReadme(false)
            }
        }
        loadReadme()
    }, [projeto])

    return (
        <>
            <div className='bg-light p-3'>
                <div className='row m-0 p-0 pt-3'>
                    <div className='col-12 justify-content-between d-flex'>
                        <button className='btn btn-link' onClick={() => navigate('/projetos')}>
                            {labels.back[language]}
                        </button>
                        <a
                            href={projeto.link} target='_blank' rel='noopener noreferrer'
                            className=' btn btn-link'>
                            {labels.openOnGitHub[language]}
                        </a>
                    </div>
                    <div className='col-12 col-lg-5 p-3'>
                        <h3><strong>{projeto.title}</strong></h3>
                        <h6 className='text-muted'>{projeto.subtitle}</h6>
                        <p>{projeto.description || labels.noDescription[language]}</p>
                    </div>
                    <div className='row m-0 p-0 pb-3'>
                        <div className='col-12 col-lg-4 pb-3 pt-0' style={{ height: '400px' }}>
                            <div className='repo-nav bg-white border h-100 overflow-auto p-3'>
                                <div className='d-flex align-items-center'>
                                    {currentFolder && (
                                        <button className='btn btn-link' onClick={() => {
                                            const parent = currentFolder.split('/').slice(0, -1).join('/')
                                            setCurrentFolder(parent)
                                        }}>
                                            {language === 'pt' ? '..' : '..'}
                                        </button>
                                    )}
                                    <span className='text-muted small'>{currentFolder || labels.root[language]}</span>
                                </div>

                                {loadingTree ? (
                                    <div className='small'>{labels.loadingStructure[language]}</div>
                                ) : (nested || []).length === 0 ? (
                                    <div className='small'>{labels.emptyStructure[language]}</div>
                                ) : (
                                    <div className='repo-nav-list'>
                                        {getNodesAtPath(nested, currentFolder).map(node => (
                                            <div key={node.path} className='d-flex justify-content-between align-items-center py-1'>
                                                {node.type === 'tree' ? (
                                                    <button className='btn btn-link p-0' onClick={() => setCurrentFolder(node.path)}>
                                                        {node.name}/
                                                    </button>
                                                ) : (
                                                    <button className='btn btn-link p-0' onClick={() => openFile(node.path)}>
                                                        {node.name}
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right: file viewer (col-8) */}
                        <div className='col-12 col-lg-8 pt-0 pb-3' style={{ height: '600px' }}>
                            <div className='bg-white border overflow-auto h-100 '>
                                <div className='small text-muted p-3 pb-0'>{selectedPath}</div>
                                {loadingFile ? (
                                    <div className='small text-muted m-0 ps-3'>{labels.loadingFile[language]}</div>
                                ) : fileContent ? (
                                    <pre className='m-0 p-3 pt-2'>{fileContent}</pre>
                                ) : (
                                    <div className='small text-muted ps-3'>{labels.noFileSelected[language]}</div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className='col-12 pb-3'>
                        <h3><strong>{labels.readmeHeader[language]}</strong></h3>
                        <div className='bg-white border p-3 overflow-auto' style={{ height: '400px' }}>
                            {loadingReadme ? (
                                <div className='small text-muted'>{labels.loadingReadme[language]}</div>
                            ) : readmeContent ? (
                                <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>{readmeContent}</ReactMarkdown>
                            ) : (
                                <div className='small text-muted'>{labels.noReadme[language]}</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>


        </>
    )
}
