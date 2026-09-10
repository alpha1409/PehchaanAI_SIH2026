import React from 'react';
import ContactUs from '../components/landing/ContactUs';

function ContactPage() {
  return (
    <div className="page-wrapper" style={{ paddingTop: '5rem', minHeight: '80vh' }}>
      <ContactUs showHeaderBadge={true} />
    </div>
  );
}

export default ContactPage;
