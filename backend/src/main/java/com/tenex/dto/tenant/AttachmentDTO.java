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
    private String fileName;
    private String fileType;
    private String fileUrl;
    private Long fileSize;
    private Long uploadedBy;
    private LocalDateTime uploadedAt;
    private Long taskId;
    private Long commentId;
    private String downloadUrl; // This will be populated when needed
}