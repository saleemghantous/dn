import { useState, useRef, useEffect, Fragment } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select';

const UpdateLoad = ({ loanValue, firstPlayer, secondPlayer, setLoanList }) => {
    const [show, setShow] = useState(false);
    const [selectedValue, setSelectedValue] = useState();
    const selectInputRef = useRef(null);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        if (show) {
            setSelectedValue({ value: loanValue, label: loanValue });
            selectInputRef.current?.focus();
        }
    }, [show]);

    const handleSave = () => {
        setLoanList((prevList) => ({
            ...prevList,
            [`${firstPlayer}_${secondPlayer}`]: selectedValue.value,
        }));
        handleClose();
    };

    const options = Array.from({ length: 51 }, (_, i) => ({
        value: i * 5,
        label: i * 5,
    }));

    const handleChange = (selectedOption) => setSelectedValue(selectedOption);

    const adjustValue = (delta) => {
        const newValue = Math.max(0, selectedValue.value + delta);
        setSelectedValue({ value: newValue, label: newValue });
    };

    return (
        <Fragment>
            <Button
                size="sm"
                style={{ width: "30px", padding: "0px", margin: "0px", fontSize: "10px" }}
                variant={loanValue > 0 ? "danger" : "primary"}
                onClick={handleShow}
            >
                {loanValue}
            </Button>

            <Modal backdrop="static" show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>({firstPlayer}) לוקח מ- ({secondPlayer})</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Select
                        value={selectedValue}
                        onChange={handleChange}
                        ref={selectInputRef}
                        options={options}
                        isSearchable={false}
                        styles={{ control: (base) => ({ ...base, minHeight: '40px' }) }}
                    />
                    <Button onClick={() => adjustValue(5)} className="mt-2" variant="success">+</Button>
                    <Button onClick={() => adjustValue(-5)} className="mt-2 mx-3" variant="danger" style={{ fontSize: "20px" }}>-</Button>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>סגור</Button>
                    <Button variant="success" onClick={handleSave}>שמירה</Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    );
};

export default UpdateLoad;
