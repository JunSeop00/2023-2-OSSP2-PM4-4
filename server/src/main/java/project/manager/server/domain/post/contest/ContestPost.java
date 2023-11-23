package project.manager.server.domain.post.contest;

import jakarta.persistence.*;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicUpdate;
import project.manager.server.domain.User;
import project.manager.server.domain.post.building.BuildingPost;
import project.manager.server.dto.request.post.contest.ContestPostRequestDto;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "CONTEST_POST_TB")
@DynamicUpdate
public class ContestPost {
    @Id
    @Column(name = "id", nullable = false, updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title")
    private String title;

    @Lob
    @Column(name = "content")
    private String content;

    @Column(name = "start_at")
    private LocalDate startAt;

    @Column(name = "end_at")
    private LocalDate endAt;

    @Column(name = "is_delete")
    private boolean isDelete;

    @Column(name = "create_at")
    private Timestamp createAt;

    // -----------------------------------------------------

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "catebory_id", nullable = false)
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scale_id", nullable = false)
    private Scale scale;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "benefit_id", nullable = false)
    private Benefit benefit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_id", nullable = false)
    private Target target;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @OneToMany(mappedBy = "contestPost", fetch = FetchType.LAZY)
    private List<BuildingPost> buildingPostList;

    @Builder
    public ContestPost(ContestPostRequestDto contestPostRequestDto, User user, Category category, Scale scale, Benefit benefit, Target target, Organization organization) {
        this.title = contestPostRequestDto.getTitle();
        this.content = contestPostRequestDto.getContent();
        this.startAt = contestPostRequestDto.getStartAt();
        this.endAt = contestPostRequestDto.getEndAt();
        this.isDelete = false;
        this.createAt = Timestamp.valueOf(LocalDateTime.now());;
        this.user = user;
        this.category = category;
        this.scale = scale;
        this.benefit = benefit;
        this.target = target;
        this.organization = organization;
    }

    public void updateContestPost(ContestPostRequestDto contestPostRequestDto, Category category, Scale scale, Benefit benefit, Target target, Organization organization) {
        this.title = contestPostRequestDto.getTitle();
        this.content = contestPostRequestDto.getContent();
        this.startAt = contestPostRequestDto.getStartAt();
        this.endAt = contestPostRequestDto.getEndAt();
        this.category = category;
        this.scale = scale;
        this.benefit = benefit;
        this.target = target;
        this.organization = organization;
    }

    public void deleteContestPost() {
        this.isDelete = true;
    }


}