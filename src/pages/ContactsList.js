import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { Modal, Button, List } from 'antd';
import AddContactForm from './contactForm';

import { getAllContacts, addNewContact, toggleShowContactModal, setFavoriteContact, setInitialValues } from '../redux/contacts';
import { setItem } from '../helpers/storage';

const constants = {
    newContact: 'Add Contact',
    modalTitle: 'Add new contact',
    listTitle: "List of contacts",
    btnFavorite: 'Favorite',
    btnAllContacts: 'All contacts',
    btnCancel: 'Cancel',
    btnEdit: 'Edit'
}

const ContactsList = ({ data, getAllContacts, modalVisible, toggleShowContactModal, setInitialValues, setFavoriteContact }) => {

    const [contacts, setContacts] = useState(data);

    useEffect(() => {
        getAllContacts();
    }, [getAllContacts])

    const prevData = useRef(data);

    useEffect(() => {
        if(prevData.current.length !== data.length){
            handleSaveContacts(data);
            setContacts(data)
        }
    }, [data])

    const handleSaveContacts = data => {
        setItem('contacts', data);
    } 
    
    const handleFavoriteContacts = () => {
        const updateContacts = contacts.filter(item => item.type === 'favorite');
        setContacts(updateContacts);
    }

    return (
        <div className="contacts-list">
            <div className="contacts-list__btns">
                <Button type="primary" onClick={() => toggleShowContactModal(true)}>{constants.newContact}</Button> 
                <Button type="primary" onClick={handleFavoriteContacts}>{constants.btnFavorite}</Button>
                <Button type="primary" onClick={() => setContacts(data)}>{constants.btnAllContacts}</Button>
            </div>
            {
                contacts.length ? <List
                                    header={<div>{constants.listTitle}</div>}
                                    bordered
                                    dataSource={contacts}
                                    renderItem={item => (
                                        <List.Item>
                                            <p>{item.name}</p>
                                            <p><span>phone:</span> {item.phone}</p>
                                            <p><span>email:</span> {item.email}</p>  
                                            <div><Button onClick={() => setInitialValues(item)}>{constants.btnEdit}</Button> <Button disabled={item.type === 'favorite'} onClick={() => setFavoriteContact(item.id)}>{constants.btnFavorite}</Button></div>
                                        </List.Item>
                                    )}
                                />
                : null
            }
            { modalVisible && <Modal
                                title={constants.modalTitle}
                                visible={modalVisible}
                                 footer=""
                                 onCancel={() =>toggleShowContactModal(false) }
                              >
                                <AddContactForm /> 
                                <Button className="close-modal" type="primary" onClick={() => toggleShowContactModal(false)}>{constants.btnCancel}</Button>
                              </Modal>
            } 
        </div>
    ) 
}

const mapSateToProps = state => ({
    data: state.contacts.data,
    modalVisible: state.contacts.visible
});

const mapDispatchToProps = {
    getAllContacts,
    addNewContact,
    toggleShowContactModal,
    setInitialValues,
    setFavoriteContact
}

export default connect(mapSateToProps, mapDispatchToProps)(ContactsList);