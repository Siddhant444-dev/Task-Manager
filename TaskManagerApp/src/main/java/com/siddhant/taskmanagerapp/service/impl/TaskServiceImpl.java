package com.siddhant.taskmanagerapp.service.impl;

import com.siddhant.taskmanagerapp.dtos.TaskRequest;
import com.siddhant.taskmanagerapp.dtos.TaskResponse;
import com.siddhant.taskmanagerapp.dtos.UpdateTaskStageRequest;
import com.siddhant.taskmanagerapp.entity.Task;
import com.siddhant.taskmanagerapp.entity.User;
import com.siddhant.taskmanagerapp.exception.TaskNotFoundException;
import com.siddhant.taskmanagerapp.exception.UserNotFoundException;
import com.siddhant.taskmanagerapp.mapper.TaskMapper;
import com.siddhant.taskmanagerapp.repository.TaskRepository;
import com.siddhant.taskmanagerapp.repository.UserRepository;
import com.siddhant.taskmanagerapp.service.TaskService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final TaskMapper taskMapper;

    @Override
    public TaskResponse createTask(TaskRequest request, Long userId) {
        log.info("Creating task for userId={}", userId);

        final User user = findUserById(userId);

        final Task task = taskMapper.toEntity(request);
        task.setUser(user);

        final Task savedTask = taskRepository.save(task);

        log.info("Task created successfully with taskId={}", savedTask.getId());

        return taskMapper.toResponse(savedTask);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getAllTasksByUser(Long userId) {
        log.debug("Fetching all tasks for userId={}", userId);

        return taskRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(taskMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public TaskResponse getTaskById(Long taskId, Long userId) {
        log.debug("Fetching taskId={} for userId={}", taskId, userId);

        final Task task = findTaskByIdAndUserId(taskId, userId);

        return taskMapper.toResponse(task);
    }

    @Override
    public TaskResponse updateTask(Long taskId, TaskRequest request, Long userId) {
        log.info("Updating taskId={} for userId={}", taskId, userId);

        final Task task = findTaskByIdAndUserId(taskId, userId);

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());

        if (request.getStage() != null) {
            task.setStage(request.getStage());
        }

        final Task updatedTask = taskRepository.save(task);

        log.info("Task updated successfully with taskId={}", taskId);

        return taskMapper.toResponse(updatedTask);
    }

    @Override
    public TaskResponse updateTaskStage(Long taskId, UpdateTaskStageRequest request, Long userId) {
        log.info("Updating task stage for taskId={} userId={}", taskId, userId);

        final Task task = findTaskByIdAndUserId(taskId, userId);

        task.setStage(request.getStage());

        final Task updatedTask = taskRepository.save(task);

        log.info("Task stage updated successfully for taskId={}", taskId);

        return taskMapper.toResponse(updatedTask);
    }

    @Override
    public void deleteTask(Long taskId, Long userId) {
        log.info("Deleting taskId={} for userId={}", taskId, userId);

        final Task task = findTaskByIdAndUserId(taskId, userId);

        taskRepository.delete(task);

        log.info("Task deleted successfully with taskId={}", taskId);
    }

    private User findUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.error("User not found with userId={}", userId);
                    return new UserNotFoundException(userId);
                });
    }

    private Task findTaskByIdAndUserId(Long taskId, Long userId) {
        return taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> {
                    log.error("Task not found with taskId={} userId={}", taskId, userId);
                    return new TaskNotFoundException(taskId);
                });
    }
}