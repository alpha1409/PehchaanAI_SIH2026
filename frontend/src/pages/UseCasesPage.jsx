import React from 'react';
import UseCases from '../components/landing/UseCases';

function UseCasesPage() {
  return (
    <div className="page-wrapper" style={{ paddingTop: '5rem', minHeight: '80vh' }}>
      <UseCases showHeaderBadge={true} />
    </div>
  );
}

export default UseCasesPage;
