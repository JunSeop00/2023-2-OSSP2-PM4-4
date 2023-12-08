package project.manager.server.dto.request.report;

import jakarta.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import project.manager.server.enums.ReportReason;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ReviewReportRequestDto {
    @NotNull
    private Long reviewId;
    @NotNull
    private Long reporterId;
    @NotNull
    private Long defendantId;
    @NotNull
    private String description;
    @NotNull
    private ReportReason reportReason;
}
