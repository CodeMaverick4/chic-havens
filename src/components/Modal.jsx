import ReactDOM from 'react-dom'
import { useDispatch } from 'react-redux'
import { closeModal } from '../redux/slices/modalReducer';

const Modal = ({ children }) => {
    const dispatch = useDispatch();
    const handleClose = () => {
        dispatch(closeModal())
    }
    const handleClickInside=(e)=>{
        e.stopPropagation();
    }
    return (
        ReactDOM.createPortal(
            <div className='modal-css ' onClick={handleClose}>
                <div className="bg-white p-5 rounded-4 position-relative" onClick={handleClickInside}>
                    <i class="bi bi-x-lg modal-cross-icon fs-4 cursor-pointer" onClick={handleClose}></i>
                    {children}
                </div>
            </div>, document.getElementById('modal'))

    )
}

export default Modal