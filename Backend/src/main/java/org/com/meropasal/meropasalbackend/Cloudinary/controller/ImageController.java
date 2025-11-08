package org.com.meropasal.meropasalbackend.Cloudinary.controller;

/**
 * Created On : 2025 16 Feb 2:26 PM
 * Author : Monu Siddiki
 * Description :
 **/
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.com.meropasal.meropasalbackend.Cloudinary.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/images")
@PreAuthorize("hasAnyRole('SHOP_OWNER')")
public class ImageController {


    private final CloudinaryService cloudinaryService;

    @Autowired
    public ImageController(CloudinaryService cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", required = false) String folder) {

        try {
            String imageUrl = cloudinaryService.uploadImage(file, folder);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("url", imageUrl);
            response.put("message", "Image uploaded successfully");

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", e.getMessage());

            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/upload-multiple")
    public ResponseEntity<Map<String, Object>> uploadMultipleImages(
            @RequestParam("files") MultipartFile[] files,
            @RequestParam(value = "folder", required = false) String folder) {

        Map<String, Object> response = new HashMap<>();
        List<String> uploadedUrls = new ArrayList<>();
        List<String> errors = new ArrayList<>();

        for (int i = 0; i < files.length; i++) {
            MultipartFile file = files[i];
            try {
                String imageUrl = cloudinaryService.uploadImage(file, folder);
                uploadedUrls.add(imageUrl);
            } catch (IOException e) {
                errors.add("File " + (i + 1) + " (" + file.getOriginalFilename() + "): " + e.getMessage());
            }
        }

        response.put("success", errors.isEmpty());
        response.put("urls", uploadedUrls);
        response.put("errors", errors);
        response.put("uploadedCount", uploadedUrls.size());
        response.put("failedCount", errors.size());

        if (!errors.isEmpty()) {
            return ResponseEntity.status(HttpStatus.MULTI_STATUS).body(response);
        }

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Map<String, Object>> deleteImage(@RequestParam("url") String imageUrl) {
        try {
            boolean deleted = cloudinaryService.deleteImage(imageUrl);

            Map<String, Object> response = new HashMap<>();
            if (deleted) {
                response.put("success", true);
                response.put("message", "Image deleted successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("error", "Image not found or unable to delete");
                return ResponseEntity.badRequest().body(response);
            }

        } catch (IOException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateImage(@RequestParam("file") MultipartFile file) {
        try {
            Map<String, Object> imageInfo = cloudinaryService.getImageInfo(file);
            Map<String, Object> validation = validateImageFile(file, imageInfo);

            Map<String, Object> response = new HashMap<>();
            response.put("valid", validation.get("valid"));
            response.put("info", imageInfo);
            response.put("warnings", validation.get("warnings"));
            response.put("errors", validation.get("errors"));

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("valid", false);
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    private Map<String, Object> validateImageFile(MultipartFile file, Map<String, Object> info) {
        List<String> warnings = new ArrayList<>();
        List<String> errors = new ArrayList<>();
        boolean valid = true;

        // Size validation
        long maxSize = 10 * 1024 * 1024; // 10MB
        if (file.getSize() > maxSize) {
            errors.add("File size exceeds 10MB limit");
            valid = false;
        }

        // Dimension validation (optional warnings)
        Integer width = (Integer) info.get("width");
        Integer height = (Integer) info.get("height");

        if (width != null && height != null) {
            if (width < 100 || height < 100) {
                warnings.add("Image dimensions are very small (less than 100x100)");
            }
            if (width > 4000 || height > 4000) {
                warnings.add("Image dimensions are very large (greater than 4000x4000)");
            }
        }

        Map<String, Object> validation = new HashMap<>();
        validation.put("valid", valid);
        validation.put("warnings", warnings);
        validation.put("errors", errors);

        return validation;
    }
}

