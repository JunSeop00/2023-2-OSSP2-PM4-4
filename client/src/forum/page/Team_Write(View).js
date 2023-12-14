//공모전 팀원 모집글(보기)
import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import Nav from "../../layout/Nav";
import Footer from "../../layout/Footer";
import styles from "../css/Team_Write(View).module.css";
import {team_CategoryKOR} from "../component/axios_category";
import axios from "axios";
import Team_WriteEdit from "./Team_Write(Edit)";
import Write_Apply from "../component/Write_Apply";

//DUMMY DATA
const write = {
    "buildingPost": {
        title: "제목",
        content: (
            <div>
                <div>안녕하세요! 제 8회 파크랜드 대학생 마케팅 공모전 팀원을 모집합니다.</div>
                <div>&nbsp;</div>
                <div>https://m.parkland.co.kr/bbs/bbs.asp?bbsId=ZWO2&amp;pType=view&amp;idx=17194</div>
                <div>&nbsp;</div>
                <div>🔻 응모 주제</div>
                <div>응모 주제 1인 '파크랜드의 미래 성장 동력 확보를 위한 신제품/신사업 제안'로 진행 예정</div>
                <div>&nbsp;</div>
                <div>🔻 진행 일정</div>
                <div>접수 마감: ~12.31</div>
                <div>시작 일정: 11월 2-3주차 때부터 진행 예정</div>
            </div>
        ),
        userId: 1,
        user: "박민기",
        creatAt: "2023-12-10"
    },
    "Front-End": [
        {
            "partId": 37,
            "partName": "React",
            "currentApplicant": 0,
            "maxApplicant": 10
        }
    ],
    "Back-End": [
        {
            "partId": 38,
            "partName": "Spring",
            "currentApplicant": 0,
            "maxApplicant": 10
        }
    ],
}

const Team_WriteView = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    //Todo: userId
    const [userId, setUserId] = useState(1);
    const [isAdmin, setIsAdmin] = useState(false);
    const [edit, setEdit] = useState(false);
    const [data, setData] = useState({
        title:"",
        writer:"",
        writerId:0,
        date:"",
        content:"",
        partList:[]
    });
    const [applyModalOpen, setApplyModalOpen] = useState(false);

    //debug
    useEffect(() => {
        if(data.title !== "")
            console.log("게시글 정보 수정됨", data);
    }, [data]);

    useEffect(() => {
        //스크롤 처리
        window.onbeforeunload = function pushRefresh() {
            window.scrollTo(0, 0);
        };

        //글 정보 받아오기
        const getData = async() => {
            try {
                const response = await axios.get(`/buildingPost/${id}`);
                const jsonData = response.data.responseDto;
                const brief = jsonData.buildingPost;
                console.log(brief);
                const catList = [];
                team_CategoryKOR.map((key) => {
                    if(jsonData[key] !== undefined)
                        catList[key] = jsonData[key];
                });
                setData({
                    title:brief.title,
                    content:brief.content,
                    writerId:brief.userId,
                    writer:brief.user,
                    createAt:brief.creatAt,
                    partList:catList,
                });
            } catch(error) {
                console.log(error);
            }
        }
        getData();

        //사용자 권한 정보 확인
        //Todo: userId - Role
        const getUser = async() => {
            try {
                const response = await axios.get(`/user/${id}`);
                const jsonData = response.data.responseDto;
            } catch(error) {
                console.log(error);
            }
        }
    }, []);

    //카테고리 렌더링
    const renderCategory = () => {
        return (
            <div className={styles.category}>
                {Object.entries(data.partList).map(([part, list]) => (
                    <div className={styles.row}>
                        <div className={styles.categoryTitle}>
                            {part}
                        </div>
                        {list.map((info) => (
                            //Todo: onClick => 모집정보 확인
                            <div>
                                <label>{info.partName}</label>
                                <label>({info.currentApplicant}</label>
                                <label>/</label>
                                <label>{info.maxApplicant})</label>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        );
    };

    //Todo: onClick => 마감/채팅/지원/지원자확인/수정/삭제
    //마감하기/채팅하기 전환
    const closeOrChat = () => {
        //마감하기
        if(isAdmin === true || id === data.writerId) {
            return (
                <button className={styles.redButton}>마감하기</button>
            );
        }
        //채팅하기
        else {
            return (
                <button className={styles.yellowButton}>채팅하기</button>
            )
        }
    }

    const applyOrCheck = () => {
        //지원자 확인
        if(isAdmin === true || id === data.writerId) {
            return (
                <button className={styles.yellowButton}>지원자 확인</button>
            );
        }
        //지원하기
        else {
            return (
                <button className={styles.yellowButton}
                        onClick={() => setApplyModalOpen(true)}>
                    지원하기</button>
            );
        }
    }

    const reportOrEdit = () => {
        //수정/삭제
        if(isAdmin === true || id === data.writerId) {
            return (
                <>
                    <button className={styles.blueButton}
                            onClick={editPost}>수정</button>
                    <button className={styles.redButton}
                            onClick={deletePost}>삭제</button>
                </>
            );
        }
        //신고하기
        else {
            return (
                <button className={styles.redButton}>신고하기</button>
            )
        }
    }
    //게시글 수정
    const editPost = () => {
        setEdit(true);
    }
    //게시글 삭제
    const deletePost = () => {
        const temp = async() => {

            if (window.confirm("게시글을 삭제하시겠습니까?")) {
                try {
                    const response = await axios.delete(`/buildingPost/${id}`);
                    if (response.status === 200) {
                        window.alert("삭제되었습니다.");
                        navigate(-1);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
        temp();
    }

    return (
        <div>
            {applyModalOpen === true ?
                <Write_Apply postInfo={data}
                             applyModalOpen={applyModalOpen}
                             setApplyModalOpen={setApplyModalOpen}
                             id={userId} /> : <></>
            }
            <Nav/>
            <div className={styles.page}>
                {edit === false ? (
                    //게시글 표시
                    <>
                        <div className={styles.titleAndCategory}>
                            <div className={styles.title}>
                                <label className={styles.T}>{data.title}</label>
                                <label className={styles.W}>{data.user}</label>
                                <label className={styles.D}>{data.createAt}</label>
                            </div>
                            {renderCategory()}
                        </div>
                        <div className={styles.body}>
                            <div className={styles.appointment}>
                                {closeOrChat()}
                                {applyOrCheck()}
                            </div>
                            <div className={styles.text} dangerouslySetInnerHTML={{__html: data.content}}/>
                            <div className={styles.report}>
                                {reportOrEdit()}
                            </div>
                        </div>
                        {/* debug: 관리자/일반 전환 */}
                        <button className={styles.whiteButton}
                                onClick={() => {
                                    if(isAdmin === false)
                                        setIsAdmin(true)
                                    else setIsAdmin(false)
                                }}>debug:관리자/일반 전환하기</button>
                    </>
                    ) : (
                    //게시글 수정
                    <Team_WriteEdit postId={id}
                                    setEdit={setEdit}
                                    data={data}
                    />
                    )}
            </div>
            <Footer/>
        </div>
    );
}

export default Team_WriteView;