import { useSelector } from 'react-redux'
import styles from './userInfoModal.module.css'
import { FC } from 'react'
import { RootState } from '../../../Redux/store'


const UserInfoModal = (props) =>{




      
    return (
        <div className={styles.userInfo}>
           <img src={props.profile} alt=""  loading="lazy" />
        </div>
    )
}



export default UserInfoModal