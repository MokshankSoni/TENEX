package com.tenex.repository.tenant;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tenex.entity.tenant.Comment;
import com.tenex.entity.tenant.Task;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByTask(Task task);

    List<Comment> findByTaskId(Long taskId);

    List<Comment> findByUserId(Long userId);

    List<Comment> findByTaskIdOrderByCreatedAtDesc(Long taskId);
}