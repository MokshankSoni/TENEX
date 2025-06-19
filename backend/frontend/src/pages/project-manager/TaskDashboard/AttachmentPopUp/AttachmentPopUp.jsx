import React, { useState } from 'react';
import './AttachmentPopUp.css';
import { FaTimes, FaDownload } from 'react-icons/fa';

const AttachmentPopUp = ({ isOpen, attachments, getFileIcon, getUserInfo, formatCommentTime, onClose, handleDownloadAttachment }) => {
    const [search, setSearch] = useState('');
    if (!isOpen) return null;

    // Sort attachments by uploadedAt descending (latest first)
    const sortedAttachments = [...(attachments || [])].sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    const filteredAttachments = sortedAttachments.filter(att =>
        att.fileName.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="attachment-popup-overlay">
            <div className="attachment-popup-modal">
                <div className="attachment-popup-header">
                    <h2>All Attachments</h2>
                    <button className="attachment-popup-close" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>
                <div className="attachment-popup-search-row">
                    <input
                        className="attachment-popup-search-input"
                        type="text"
                        placeholder="Search by file name..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div className="attachment-popup-list">
                    {filteredAttachments.length === 0 ? (
                        <div className="attachment-popup-empty">No attachments found.</div>
                    ) : (
                        filteredAttachments.map(attachment => {
                            const userInfo = getUserInfo(attachment.uploadedBy);
                            return (
                                <div key={attachment.id} className="attachment-popup-item">
                                    <div className="attachment-popup-file-row">
                                        <div className="attachment-popup-file-icon">{getFileIcon(attachment.fileType)}</div>
                                        <div className="attachment-popup-file-details">
                                            <span className="attachment-popup-file-name">{attachment.fileName}</span>
                                            <span className="attachment-popup-file-meta">
                                                {attachment.fileType} • {attachment.fileSize} bytes
                                            </span>
                                            <span className="attachment-popup-file-meta">
                                                Uploaded by {userInfo.username} {userInfo.roles.length > 0 && (
                                                    <span className="attachment-popup-user-role">({userInfo.roles[0].replace('ROLE_', '').replace('_', ' ')})</span>
                                                )} • {formatCommentTime(attachment.uploadedAt)}
                                            </span>
                                        </div>
                                        <button className="attachment-popup-download-btn" onClick={() => handleDownloadAttachment && handleDownloadAttachment(attachment)}><FaDownload /></button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default AttachmentPopUp; 