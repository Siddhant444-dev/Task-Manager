package com.siddhant.taskmanagerapp.dtos;

import com.siddhant.taskmanagerapp.entity.Stage;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateTaskStageRequest {

    @NotNull(message = "Stage is required")
    private Stage stage;
}
