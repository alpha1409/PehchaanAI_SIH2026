import React from 'react';
import Modules from '../components/landing/Modules';

function ModulesPage() {
  return (
    <div className="page-wrapper" style={{ paddingTop: '5rem', minHeight: '80vh' }}>
      <Modules showHeaderBadge={true} />
    </div>
  );
}

export default ModulesPage;
