import { useContext, useEffect, useState, useRef } from "react";
import AuthContext from "../../context/authContext";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation, faPen } from '@fortawesome/free-solid-svg-icons';
import ConfirmPostModal from "./ConfirmPostModal";

const modalIcon = <FontAwesomeIcon icon={faCircleExclamation} />
const penIcon = <FontAwesomeIcon icon={faPen} />

// Modifier les informations de l'utilisateur
const UpdatePost = ({ propPostData, propIsAdmin, updatePostModifed }) => {
    const authCtx = useContext(AuthContext);

    const [ popUpConfirm, setPopUpConfirm ] = useState(false);

    const [ postDataUpdate, setPostDataUpdate ] = useState(propPostData);
    const [ dataPicture, setDataPicture ] = useState(propPostData.postPicture);
    const [ newDataPicture, setNewDataPicture ] = useState('');

    const [ errorServer, setErrorServer ] = useState('');

    const messageInputRef = useRef();

    useEffect(() => {
        setPostDataUpdate(propPostData);
        setDataPicture(propPostData.postPicture);
    }, [propPostData, propPostData.postPicture])

    // Surveiller les modifications faites (message)
    const changeHandlerMessage = (e) => {
        const enteredMessage = messageInputRef.current.value;

        setPostDataUpdate({
            ...propPostData,
            'message': enteredMessage,
        })
    }

    // Surveiller les modifications faites (image)
    const changeHandlerPicture = (e) => {
        let newPicture;

        if (e.target.files) {
            newPicture = URL.createObjectURL(e.target.files[0])
            setNewDataPicture(e.target.files[0])
            
        }
        setDataPicture(newPicture)
    }

    const cancelConfirm = () => {
        setPopUpConfirm(false)
    }

    const updateHandler = () => {
        setPopUpConfirm(true)
    }

    // Utilisation de dotenv
    const API_URL_POST = process.env.REACT_APP_API_URL_POST;
    const url = `${API_URL_POST}/${propPostData._id}`;

    const confirmUpdate = async (e) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append('isAdmin', propIsAdmin);
        formData.append('message', postDataUpdate.message);
        formData.append('image', newDataPicture);
 
        await axios.put(url, formData, {
            headers: {
                Authorization: `Bearer ${authCtx.token}`,
            },
        })
            .then((res) => {
                setPopUpConfirm(false);
                alert('Modification(s) enregistrée(s) !');
                updatePostModifed(res.data);
            })
            .catch(() => {
                setErrorServer({ ...errorServer, message: 'Une erreur interne est survenue. Merci de revenir plus tard.' });
            })
    };

    return (
        <>
        {popUpConfirm && <ConfirmPostModal
            icon={modalIcon}
            title='Éditer le post'
            // Input message
            onChangeMessage={changeHandlerMessage}
            defaultValueMessage={postDataUpdate.message}
            refMessage={messageInputRef}
            // Input image
            postPicture={dataPicture}
            onChangePicture={changeHandlerPicture}
            // ErrorServer
            error={errorServer}
            errorServer={errorServer.message}
            // Buttons
            onCancel={cancelConfirm}
            onConfirm={confirmUpdate}
        />}
            <i onClick={updateHandler} title='Éditer' className='trending_container_post_icons_icon trending_container_post_icons_icon_modify'>{penIcon}</i>
        </>
        
    )
}

export default UpdatePost;