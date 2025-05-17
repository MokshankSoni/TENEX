package com.tenex.entity.tenant;



import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "task_checklists")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskChecklist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @Column(name = "item", nullable = false)
    private String item;

    @Column(name = "completed")
    private Boolean completed = false;
}