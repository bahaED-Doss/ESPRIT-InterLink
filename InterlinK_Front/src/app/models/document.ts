export class Document {
    id?: number;            // Optional, if not defined yet (e.g., before upload)
  documentType?: string;   // For example: "letterOfAssignment", "stageRequest", etc.
  fileName?: string;      // The name of the file uploaded
  filePath?: string;      // (Optional) The storage path or URL of the file
  // You can add more fields as necessary (e.g., uploadDate)
}
