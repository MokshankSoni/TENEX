package com.tenex.dto.tenant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttachmentDTO {
    private Long id;
    private Long taskId;
    private Long commentId;
    private String fileName;
    private String fileType;
    private Long fileSize;
    private String fileUrl;
    private Long uploadedBy;
    private LocalDateTime uploadedAt;
}