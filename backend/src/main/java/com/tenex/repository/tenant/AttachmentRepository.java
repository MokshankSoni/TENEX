package com.tenex.repository.tenant;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tenex.entity.tenant.Attachment;
import com.tenex.entity.tenant.Task;
import com.tenex.entity.tenant.Comment;

import java.util.List;

@Repository
public interface AttachmentRepository extends JpaRepository<Attachment, Long> {

    List<Attachment> findByTask(Task task);

    List<Attachment> findByTaskId(Long taskId);

    List<Attachment> findByComment(Comment comment);

    List<Attachment> findByCommentId(Long commentId);

    List<Attachment> findByUploadedBy(Long userId);

    List<Attachment> findByFileType(String fileType);
}