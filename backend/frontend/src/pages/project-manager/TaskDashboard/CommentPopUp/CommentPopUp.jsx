import React from 'react';
import './CommentPopUp.css';
import { FaTimes, FaUserCircle } from 'react-icons/fa';

const CommentPopUp = ({ isOpen, comments, getUserInfo, formatRole, formatCommentTime, onClose }) => {
    if (!isOpen) return null;

    // Sort comments by createdAt descending (latest first)
    const sortedComments = [...(comments || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
        <div className="comment-popup-overlay">
            <div className="comment-popup-modal">
                <div className="comment-popup-header">
                    <h2>All Comments</h2>
                    <button className="comment-popup-close" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>
                <div className="comment-popup-list">
                    {sortedComments.length === 0 ? (
                        <div className="comment-popup-empty">No comments yet.</div>
                    ) : (
                        sortedComments.map(comment => {
                            const userInfo = getUserInfo(comment.userId);
                            return (
                                <div key={comment.id} className="comment-popup-item">
                                    <div className="comment-popup-header-row">
                                        <div className="comment-popup-user-details">
                                            <FaUserCircle className="comment-popup-user-icon" />
                                            <span>{userInfo.username}</span>
                                            {userInfo.roles.length > 0 && (
                                                <span className="comment-popup-user-role">{formatRole(userInfo.roles)}</span>
                                            )}
                                        </div>
                                        <span className="comment-popup-timestamp">{formatCommentTime(comment.createdAt)}</span>
                                    </div>
                                    <div className="comment-popup-content">{comment.content}</div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommentPopUp; 