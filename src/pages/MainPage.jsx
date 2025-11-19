import { useSelector } from "react-redux"
import ChatBot from "../components/ChatIcon"
import LoginForm from "../components/LoginForm"
import SignUpForm from "../components/SignUpForm"
import MainLayout from "../layout/MainLayout"
import Modal from "../components/Modal"

export default function MainPage() {
const view = useSelector(state => state.modalForm)
    const user = useSelector(state => state.auth)
    return (
        <>
            <MainLayout />
            {view &&
                <Modal>
                    {view === "login" ?
                        <LoginForm />
                        :
                        <SignUpForm />
                    }
                </Modal>}
            <div>
                <ChatBot user={user} />
            </div>
        </>
    )
}
