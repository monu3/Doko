package org.com.meropasal.meropasalbackend.Cloudinary.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created On : 2025 16 Feb 2:24 PM
 * Author : Monu Siddiki
 * Description :
 **/
@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    @Autowired
    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public String uploadImage(MultipartFile file) throws IOException {
        return uploadImage(file, null);
    }

    public String uploadImage(MultipartFile file, String folder) throws IOException {
        try {
            // Validate file
            if (file.isEmpty()) {
                throw new IOException("File is empty");
            }

            // Validate file size
            if (file.getSize() > 10 * 1024 * 1024) { // 10MB
                throw new IOException("File size too large. Maximum size is 10MB");
            }

            // Validate file type
            String contentType = file.getContentType();
            if (!isValidImageType(contentType)) {
                throw new IOException("Invalid image type. Only JPEG, PNG, and WebP are allowed");
            }

            Map<String, Object> uploadOptions = new HashMap<>();
            uploadOptions.put("resource_type", "auto");

            // Use provided folder or default to "general"
            if (folder != null && !folder.trim().isEmpty()) {
                uploadOptions.put("folder", folder.trim());
            } else {
                uploadOptions.put("folder", "general");
            }

            // Upload to Cloudinary
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadOptions);

            // Return the secure URL
            return uploadResult.get("secure_url").toString();

        } catch (Exception e) {
            throw new IOException("Image upload failed: " + e.getMessage());
        }
    }

    public String uploadImage(MultipartFile file, String folder, Map<String, Object> transformations) throws IOException {
        String imageUrl = uploadImage(file, folder);

        // Apply transformations if provided
        if (transformations != null && !transformations.isEmpty()) {
            // You can add transformation logic here if needed
            // For now, we'll return the basic URL
            // Cloudinary transformations can be applied when generating the URL
        }

        return imageUrl;
    }

    public boolean deleteImage(String imageUrl) throws IOException {
        try {
            // Extract public ID from Cloudinary URL
            String publicId = extractPublicId(imageUrl);
            if (publicId == null) {
                return false;
            }

            Map<?, ?> result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            return "ok".equals(result.get("result"));
        } catch (Exception e) {
            throw new IOException("Image deletion failed: " + e.getMessage());
        }
    }

    private String extractPublicId(String imageUrl) {
        try {
            // Cloudinary URL pattern: https://res.cloudinary.com/cloudname/image/upload/v1234567/folder/public_id.jpg
            String pattern = "/([^/]+)\\.[a-zA-Z]+$";
            Pattern r = Pattern.compile(pattern);
            Matcher m = r.matcher(imageUrl);

            if (m.find()) {
                String withVersion = m.group(1);
                // Remove version part if present
                return withVersion.replaceFirst("^v\\d+/", "");
            }
        } catch (Exception e) {
            // Log error but don't throw
            System.err.println("Error extracting public ID: " + e.getMessage());
        }
        return null;
    }

    private boolean isValidImageType(String contentType) {
        if (contentType == null) return false;

        return contentType.equals("image/jpeg") ||
                contentType.equals("image/jpg") ||
                contentType.equals("image/png") ||
                contentType.equals("image/webp") ||
                contentType.equals("image/gif") ||
                contentType.equals("image/svg+xml");
    }

    // Helper method to get image info without uploading
    public Map<String, Object> getImageInfo(MultipartFile file) throws IOException {
        Map<String, Object> info = new HashMap<>();

        try {
            // Get dimensions
            BufferedImage image = ImageIO.read(file.getInputStream());
            if (image != null) {
                info.put("width", image.getWidth());
                info.put("height", image.getHeight());
            }

            info.put("size", file.getSize());
            info.put("contentType", file.getContentType());
            info.put("originalFilename", file.getOriginalFilename());

        } catch (Exception e) {
            throw new IOException("Cannot read image information: " + e.getMessage());
        }

        return info;
    }
}
