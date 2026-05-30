package com.siddhant.taskmanagerapp.dtos;

import com.siddhant.taskmanagerapp.entity.Stage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TaskResponse {

    private Long id;
    private String title;
    private String description;
    private Stage stage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
