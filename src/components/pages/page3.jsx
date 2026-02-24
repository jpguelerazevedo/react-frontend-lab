import React from 'react'
import { post } from '../data/data';
import './style.css'
import { useLanguage } from '../../context/LanguageContext'

function page3() {
    ;
    const { language } = useLanguage()

    return (


        <div className='row m-3'>
            <div className='col-12 p-3'>
                <h3 className=''>Postagens</h3>
            </div>
            {post.map((p, index) => {
                return (
                    <div key={index} className='col-12 p-3'>
                        <div className='row align-items-end border p-3'>
                            <div className='col-md-3 col-12'>
                                <img src={p.image.url} alt={p.image.alt} className='img-fluid rounded' />
                            </div>
                            <div className='col-md-9 col-12'>
                                <h4 className='mb-0'><strong>{p.title[language]}</strong></h4>
                                <p className='text-muted '>{p.subtitle[language]}</p>
                                <h6 className=''>{p.description[language]}</h6>
                                <div className='d-flex align-items-center'>
                                    <small className='text-muted'>{p.data[language]}</small>
                                    <small className='text-muted mb-0'>{p.local[language]}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
export default page3;
