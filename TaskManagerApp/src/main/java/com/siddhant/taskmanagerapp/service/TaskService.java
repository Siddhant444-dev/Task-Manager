package com.siddhant.taskmanagerapp.service;

import com.siddhant.taskmanagerapp.dtos.TaskRequest;
import com.siddhant.taskmanagerapp.dtos.TaskResponse;
import com.siddhant.taskmanagerapp.dtos.UpdateTaskStageRequest;

import java.util.List;

public interface TaskService {
    TaskResponse createTask(TaskRequest request, Long userId);

    List<TaskResponse> getAllTasksByUser(Long userId);

    TaskResponse getTaskById(Long taskId, Long userId);

    TaskResponse updateTask(Long taskId, TaskRequest request, Long userId);

    TaskResponse updateTaskStage(Long taskId, UpdateTaskStageRequest request, Long userId);

    void deleteTask(Long taskId, Long userId);
}
