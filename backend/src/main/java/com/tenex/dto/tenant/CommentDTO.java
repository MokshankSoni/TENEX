package com.tenex.dto.tenant;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentDTO {
    private Long id;
    private String content;
    private Long userId;
    private Long taskId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}