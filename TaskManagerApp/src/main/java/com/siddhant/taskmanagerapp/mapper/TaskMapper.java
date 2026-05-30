package com.siddhant.taskmanagerapp.mapper;

import com.siddhant.taskmanagerapp.dtos.TaskRequest;
import com.siddhant.taskmanagerapp.dtos.TaskResponse;
import com.siddhant.taskmanagerapp.entity.Stage;
import com.siddhant.taskmanagerapp.entity.Task;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface TaskMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "stage",
            source = "stage",
            qualifiedByName = "mapStatus")
    Task toEntity(TaskRequest request);

    TaskResponse toResponse(Task task);

    @Named("mapStatus")
    default Stage mapStatus(Stage stage) {
        return stage != null ? stage : Stage.TODO;
    }
}
