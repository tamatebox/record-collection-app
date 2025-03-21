import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import RecordList from './components/records/list/RecordList';
import RecordFilter from './components/records/filter/RecordFilter';
import RecordDetail from './components/records/detail/RecordDetail';
import AddRecordForm from './components/records/form/AddRecordForm';
import DiscogsCallback from './components/discogs/DiscogsCallback';
import DiscogsSearch from './components/discogs/DiscogsSearch';
import DiscogsAuthButton from './components/discogs/DiscogsAuthButton';
import { useRecords } from './hooks/useRecords';
import ErrorView from './components/common/ErrorView';
import LoadingView from './components/common/LoadingView';
import { DiscogsAuthProvider, useDiscogsAuth } from './contexts/DiscogsAuthContext';

// AppコンテンツをAuthコンテキストを使うように分離
const AppContent = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const { isAuthenticated } = useDiscogsAuth();
  
  const {
    filteredRecords,
    selectedRecord,
    loading,
    error,
    filters,
    sortConfig,
    handleFilterChange,
    handleSort,
    handleRecordSelect,
    handleRecordDelete,
    handleAddRecord,
    handleCloseDetail,
    getMetadata,
    handleUpdateRecord
  } = useRecords();

  if (loading) {
    return <LoadingView />;
  }

  if (error) {
    return <ErrorView error={error} />;
  }

  const metadata = getMetadata();

  const handleAddFormSubmit = async (newRecord) => {
    try {
      await handleAddRecord(newRecord);
      setShowAddForm(false);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>レコードコレクション</h1>
          <div className="header-actions">
            <button 
              className="add-button" 
              onClick={() => setShowAddForm(true)}
            >
              レコードを追加
            </button>
          </div>
          {/* エラー時のみ表示 */}
          <DiscogsAuthButton className="discogs-error-message" />
        </div>
      </header>
      
      <main className="app-main">
        <div className="content-panel">
          <RecordFilter 
            filters={filters} 
            onFilterChange={handleFilterChange}
            genres={metadata.genres}
            countries={metadata.countries}
            decades={metadata.decades}
            sizes={metadata.sizes}
          />
          <RecordList 
            records={filteredRecords} 
            onRecordSelect={handleRecordSelect}
            onRecordDelete={handleRecordDelete}
            onSort={handleSort}
            sortConfig={sortConfig}
          />
        </div>
      </main>
      
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal">
            <AddRecordForm 
              onAddRecord={handleAddFormSubmit} 
              onCancel={() => setShowAddForm(false)}
              genres={metadata.genres}
              countries={metadata.countries}
              isDiscogsAvailable={isAuthenticated}
            />
          </div>
        </div>
      )}
      
      {selectedRecord && (
        <div className="modal-overlay">
          <div className="modal detail-modal">
            <RecordDetail 
              record={selectedRecord} 
              onClose={handleCloseDetail} 
              onUpdate={handleUpdateRecord}
              genres={metadata.genres}
              countries={metadata.countries}
              isDiscogsAvailable={isAuthenticated}
            />
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <DiscogsAuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AppContent />} />
          <Route path="/discogs-callback" element={<DiscogsCallback />} />
          <Route path="/discogs-search" element={<DiscogsSearch />} />
        </Routes>
      </Router>
    </DiscogsAuthProvider>
  );
}

export default App;
