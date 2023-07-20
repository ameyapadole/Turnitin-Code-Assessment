import React, { ChangeEvent, FC, useState } from 'react';
import './App.css';
import { Membership } from './Type';
import { fetchMembers } from './Api';
import { Button, Input, Modal, ModalBody, ModalHeader } from 'reactstrap';
import turnitinLogo from './turnitin-logo.png';

const App: FC<any> = () => {
  const [memberships, setMemberships] = useState<Array<Membership>>([]);
  const [search, setSearch] = useState<string>();
  const [activeMembership, setActiveMembership] = useState<Membership>();

  const loadMemberships = () => {
    return fetchMembers()
      .then(membershipList => setMemberships(membershipList.memberships))
  }

  const updateSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  }

  const loadDetailsModal = (membership: Membership) => {
    setActiveMembership(membership);
 
  }
  
  //Code Fix: membership:Membership parameter was missing in closeDetailsModal function;

  const closeDetailsModal = (membership: Membership) => {
    setActiveMembership(undefined);
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={turnitinLogo} alt='logo' />
        <div className='user-inputs'>
          <Button color='primary' className='fetch-btn' onClick={loadMemberships}>Fetch Memberships</Button>
          <Input type='text' placeholder='Search' onChange={updateSearch} />
        </div>
        {
          memberships && memberships.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                  { memberships.filter(membership => !search
                    || membership.user?.name.toLowerCase().includes(search.toLowerCase())
            
                    //Code fix for search by email: convert email to lowercase
                
                    || membership.user?.email.toLowerCase().includes(search.toLowerCase())) 
                    .map(membership => (
                      <tr key={membership.id}>
                        <td>{membership.user?.name}</td>
                        <td>{membership.user?.email}</td>
                        <td>
                          <Button color='primary' outline onClick={e => loadDetailsModal(membership)}>Details</Button>
                        </td>
                      </tr>
                    ))
                }
              </tbody>
            </table>
          )
        }
        { activeMembership &&
          (
            <Modal isOpen={!!activeMembership}>
              <ModalHeader toggle={e => closeDetailsModal(activeMembership)}>User Details</ModalHeader>
              <ModalBody>
                <div>
                  <p>Name: {activeMembership.user?.name}</p>
                  <p>Email: {activeMembership.user?.email}</p>
                  <p>Membership ID: {activeMembership.id}</p>
                  <p>User ID: {activeMembership.user?.id}</p>
                  <p>Role: {activeMembership.role}</p>
                </div>
              </ModalBody>
            </Modal>
          )
        }
      </header>
    </div>
  );
}

export default App;
