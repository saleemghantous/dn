import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


toast.configure()

export const notify = (type, messgae) => {
    if (type == "warning") {
        toast.warning(messgae)
    }
    else if (type == "success") {
        toast.success(messgae)
    }
    else if (type == "error") {
        toast.error(messgae)
    }
    else if (type == "info") {
        toast.info(messgae)
    }
    else {
        toast.info(messgae)
    }
}

