import React from 'react';
import './ConfirmDialog.css';

const ConfirmDialog = ({ isOpen, title = 'Confirm', message, onConfirm, onCancel }) => {
    if (!isOpen) return null;
    return (
        <div className="confirm-dialog-overlay">
            <div className="confirm-dialog-modal">
                <div className="confirm-dialog-header">
                    <h3>{title}</h3>
                </div>
                <div className="confirm-dialog-message">{message}</div>
                <div className="confirm-dialog-actions">
                    <button className="confirm-dialog-btn confirm" onClick={onConfirm}>Yes</button>
                    <button className="confirm-dialog-btn cancel" onClick={onCancel}>No</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog; 