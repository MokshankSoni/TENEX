package com.tenex.repository.tenant;

import com.tenex.entity.tenant.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    @Query("SELECT c FROM Comment c WHERE c.task.id = :taskId ORDER BY c.createdAt DESC")
    List<Comment> findByTaskId(@Param("taskId") Long taskId);

    @Query("SELECT c FROM Comment c LEFT JOIN FETCH c.task WHERE c.id = :id")
    Comment findByIdWithTask(@Param("id") Long id);

    @Query("SELECT c FROM Comment c JOIN c.task t WHERE t.project.id = :projectId ORDER BY c.createdAt DESC")
    List<Comment> findByProjectId(@Param("projectId") Long projectId);
}