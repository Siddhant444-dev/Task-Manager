package com.siddhant.taskmanagerapp.controller;

import com.siddhant.taskmanagerapp.dtos.TaskRequest;
import com.siddhant.taskmanagerapp.dtos.TaskResponse;
import com.siddhant.taskmanagerapp.dtos.UpdateTaskStageRequest;
import com.siddhant.taskmanagerapp.security.CustomUserDetails;
import com.siddhant.taskmanagerapp.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@RequestMapping(path = "/api/v1/tasks")
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(
            @Valid @RequestBody TaskRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        TaskResponse createdTask = taskService.createTask(request, currentUser.getUserId());
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
    }

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getAllTasksByUser(
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        List<TaskResponse> tasks = taskService.getAllTasksByUser(currentUser.getUserId());
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{taskId}")
    public ResponseEntity<TaskResponse> getTaskById(
            @PathVariable Long taskId,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        TaskResponse task = taskService.getTaskById(taskId, currentUser.getUserId());
        return ResponseEntity.ok(task);
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable Long taskId,
            @Valid @RequestBody TaskRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        TaskResponse updatedTask = taskService.updateTask(taskId, request, currentUser.getUserId());
        return ResponseEntity.ok(updatedTask);
    }

    @PatchMapping("/{taskId}/stage")
    public ResponseEntity<TaskResponse> updateTaskStage(
            @PathVariable Long taskId,
            @Valid @RequestBody UpdateTaskStageRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        TaskResponse updatedTask = taskService.updateTaskStage(taskId, request, currentUser.getUserId());
        return ResponseEntity.ok(updatedTask);
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<String> deleteTask(
            @PathVariable Long taskId,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        taskService.deleteTask(taskId, currentUser.getUserId());
        return ResponseEntity.ok("Task deleted successfully");
    }
}