package com.siddhant.taskmanagerapp.dtos;

import com.siddhant.taskmanagerapp.entity.Stage;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TaskRequest {

    @NotBlank(message = "Title is required")
    private String title;
    private String description;
    private Stage stage;
}
