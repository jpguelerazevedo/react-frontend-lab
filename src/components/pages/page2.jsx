
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import './style.css'
import { useLanguage } from '../../context/LanguageContext';

function Page2() {
    const { language } = useLanguage();
    const [githubProjects, setGithubProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Busca os repositórios públicos do GitHub do usuário jpguelerazevedo
        fetch('https://api.github.com/users/jpguelerazevedo/repos')
            .then(response => response.json())
            .then(data => {
                if (!Array.isArray(data)) {
                    console.error("API não retornou uma lista de repositórios:", data);
                    setGithubProjects([]);
                    setLoading(false);
                    return;
                }

                // Ordena por data de atualização (mais recentes primeiro)
                const sortedData = data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

                // Formata os dados da API para o mesmo formato dos projetos estáticos
                const formatted = sortedData.map(repo => ({
                    title: repo.name,
                    subtitle: repo.language || 'GitHub',
                    description: repo.description, // Mantém original ou null
                    link: repo.html_url,
                    repoName: repo.name,
                    owner: repo.owner?.login,
                    default_branch: repo.default_branch || 'main'
                }));
                setGithubProjects(formatted);
                setLoading(false);
            })
            .catch(error => {
                console.error("Erro ao buscar projetos do GitHub:", error);
                setGithubProjects([]); // Garante que em caso de erro, a lista fique vazia
                setLoading(false);
            });
    }, []);

    // Usa apenas os projetos do GitHub
    const todosProjetos = githubProjects;

    if (loading && githubProjects.length === 0) {
        // Opcional: mostrar loading ou apenas renderizar o que tem
    }

    const navigate = useNavigate()

    return (
        <div className='row m-3'>
            <div className='col-12  p-3'>
                <h3>{language === 'pt' ? 'Projetos' : 'Projects'}</h3>
            </div>
            {todosProjetos.map((projeto, index) => (
                <div key={index} className='col-12 col-lg-6 pb-3'>
                    <div className='p-3 bg-light border border-black h-100 d-flex flex-column'>
                        <h4><strong>{projeto.title}</strong></h4>
                        <h6 className='text-muted'>{projeto.subtitle}</h6>
                        <p className=''>{projeto.description || (language === 'pt' ? 'Sem descrição.' : 'No description.')}</p>
                        <button className='btn btn-link mt-auto p-0 ms-auto' onClick={() => navigate('/repo', { state: projeto })}>{language === 'pt' ? 'Ver projeto' : 'View project'}</button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Page2;