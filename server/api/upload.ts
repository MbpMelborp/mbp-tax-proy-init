import formidable from "formidable";
import fs from "fs";
import path from "path";

/**
 * Event handler for managing file uploads and deletions
 * Handles image file uploads with validation and custom naming
 *
 * @param {Object} event - The event object containing request and response information
 * @returns {Promise<Object>} Response object with upload status or deletion confirmation
 *
 * POST endpoint:
 * Accepts multipart form data with an image file
 * Query parameters:
 * - template: Template identifier for the image
 * - name: Custom name component for the saved file
 *
 * DELETE endpoint:
 * Handles file deletion requests
 */
export default defineEventHandler(async (event) => {
  // Handle POST requests for file uploads
  if (event.req.method === "POST") {
    let imageUrl = ""; // URL where the uploaded image will be accessible
    let oldPath = ""; // Temporary path where formidable stores the upload
    let newPath = ""; // Final path where we'll store the image

    // Extract query parameters
    const { template, name } = getQuery(event);

    // Initialize formidable for handling multipart form data
    var form = new formidable.IncomingForm();

    // Process the upload using a Promise wrapper around formidable
    const data = await new Promise((resolve, reject) => {
      form.parse(event.node.req, (err, fields, files) => {
        console.log("files ", files);
        const image = files.image;

        // Handle parsing errors
        if (err) {
          reject(err);
        }

        // Validate image presence
        if (!image) {
          resolve({
            status: "error",
            message: "Please upload a photo with name photo in the form",
          });
        }

        // Validate that the uploaded file is an image
        if (image.mimetype.startsWith("image/")) {
          // Generate unique filename using template, name, timestamp and random number
          let imageName =
            template +
            "-" +
            name +
            "-" +
            Date.now() +
            Math.round(Math.random() * 100000) +
            image.originalFilename;

          // Set up paths for file movement
          oldPath = image.filepath;
          newPath = `${path.join("public", "uploads", imageName)}`;

          // Construct the public URL for accessing the image
          imageUrl = event.node.req.headers.origin + "/uploads/" + imageName;

          // Copy file from temp location to permanent storage
          fs.copyFileSync(oldPath, newPath);

          resolve(imageUrl);
        } else {
          // Reject non-image files
          resolve({
            status: "error",
            message: "Please upload nothing but images.",
          });
        }
      });
    });

    return data;
  }

  // Handle DELETE requests for file removal
  if (event.req.method === "DELETE") {
    return readBody(event).then((body) => {
      const rd = Math.random();
      /**
       * TODO: Implement actual file deletion logic
       * - Validate file existence
       * - Check permissions
       * - Remove file using fs.unlink
       * - Handle errors
       */
      return {
        status: "success",
        rd,
      };
    });
  }
});
