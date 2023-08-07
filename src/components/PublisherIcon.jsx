import React from 'react'
import './PublisherIcon.css'
function PublisherIcon({publisher}) {
    if(publisher!=null)
    {
        return (
            <p className='box'>
                <span>{publisher}</span>
            </p>
          )
    }

}

export default PublisherIcon