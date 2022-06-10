package com.dms.backend.documents.model;

import lombok.Data;

@Data
public class MoveRequest {
    String filePath;
    String moveToPath;
}
