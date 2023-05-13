package com.example.chattingservice.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.chattingservice.common.exception.ApiException;
import com.example.chattingservice.common.exception.ExceptionEnum;
import com.example.chattingservice.dto.response.ChatRoomResponseDto;
import com.example.chattingservice.dto.response.InterestResponseDto;
import com.example.chattingservice.entity.Keyword;
import com.example.chattingservice.entity.chat.WaitingRoom;
import com.example.chattingservice.entity.member.Member;
import com.example.chattingservice.repository.InterestRepository;
import com.example.chattingservice.repository.MemberRepository;
import com.example.chattingservice.repository.KeywordRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import static com.example.chattingservice.entity.redis.RedisKey.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChattingServiceImpl implements ChattingService {
	private final InterestRepository interestRepository;
	private final KeywordRepository keywordRepository;
	private final MemberRepository memberRepository;
	private final SimpMessagingTemplate messagingTemplate;
	private final RedisService redisService;
	private final ObjectMapper objectMapper;

	private final RedisTemplate redisTemplate;

	@Value("${spring.img.baseurl}")
	private String baseImgUrl;

	@PostConstruct
	public void init() {
		redisService.deleteRooms(WAITING.getKey());
	}

	/**
	 * 김윤미
	 * explain : 전체 관심사 조회
	 * @return : 전체 관심사 정보
	 */
	@Override
	@Transactional
	public List<InterestResponseDto> getInterests() {
		List<InterestResponseDto> interests = interestRepository.findAll()
			.stream()
			.map(InterestResponseDto::new)
			.collect(
				Collectors.toList());
		if (interests.isEmpty()) {
			throw new ApiException(ExceptionEnum.INTERESTS_NOT_FOUND_EXCEPTION);
		}
		return interests;
	}

	@Override
	public synchronized void createWaiting(String token) {
		token = token.replace("Bearer ", "");
		Long memberId = Long.valueOf(redisService.getMemberId(token));
		if (memberId == null) {
			new ApiException(ExceptionEnum.MEMBER_NOT_FOUND_EXCEPTION);
		}
		Member member = memberRepository.findById(memberId)
			.orElseThrow(() -> new ApiException(ExceptionEnum.MEMBER_NOT_FOUND_EXCEPTION));

		int score = member.getScore();
		int scoreLimit = getScoreLimit(score);
		boolean existRoom = redisService.existRooms(WAITING.getKey(), score - scoreLimit,
			score + scoreLimit);
		WaitingRoom chatRoom = WaitingRoom.builder()
			.roomId(UUID.randomUUID().toString())
			.createdBy(member.getNickname()).createdAt(LocalDateTime.now()).build();
		if (!existRoom) {
			redisService.addWaitingRoom(WAITING.getKey(), chatRoom, score);
		} else {
			if (!redisService.existRoom(WAITING.getKey(), chatRoom)) {
				createRoom(member, score, scoreLimit);
			}
		}
	}

	public int getScoreLimit(int score) {
		return (score >= 30 && score <= 70) ? 30 : 40;
	}

	public void createRoom(Member member, int score, int scoreLimit) {
		Set<WaitingRoom> waitingRoomSet = redisService.getWaitingRoom(WAITING.getKey(), score - scoreLimit,
			score + scoreLimit);
		List<WaitingRoom> waitingRooms = new ArrayList<>();
		for (Object roomObject : waitingRoomSet) {
			WaitingRoom waitingRoom = objectMapper.convertValue(roomObject, WaitingRoom.class);
			waitingRooms.add(waitingRoom);
		}
		waitingRooms.sort(Comparator.comparing(WaitingRoom::getCreatedAt));
		WaitingRoom room = waitingRooms.get(0);
		Member opposite = memberRepository.findMemberByNickname(room.getCreatedBy())
			.orElseThrow(() -> new ApiException(ExceptionEnum.MEMBER_NOT_FOUND_EXCEPTION));

		Keyword keyword = keywordRepository.findKeyword();

		String startNickname = getStartNickname(member.getNickname(), opposite.getNickname());
		ChatRoomResponseDto chatRoom = ChatRoomResponseDto.builder()
			.roomId(room.getRoomId())
			.startNickname(startNickname)
			.keyword(keyword.getKeyword())
			.exampleEng(keyword.getExampleEng())
			.exampleKor(keyword.getExampleKor())
			.build();

		chatRoom.setOtherInfo(opposite.getNickname(), getProfileImg(opposite.getProfile()));
		sendChatRoomToUser(member.getNickname(), chatRoom);
		log.info("{}'s ROOM: {}", member.getNickname(), chatRoom);
		chatRoom.setOtherInfo(member.getNickname(), getProfileImg(member.getProfile()));
		sendChatRoomToUser(opposite.getNickname(), chatRoom);
		log.info("{}'s ROOM: {}", opposite.getNickname(), chatRoom);
		redisService.deleteRoom(WAITING.getKey(), room);
	}

	public String getStartNickname(String myNickname, String opNickname) {
		int randomVal = (int)(Math.random() * 2);
		return randomVal == 0 ? myNickname : opNickname;
	}

	public String getProfileImg(String profile) {
		return profile == null ? baseImgUrl : profile;
	}

	public void sendChatRoomToUser(String senderNickname, ChatRoomResponseDto chatRoom) {
		messagingTemplate.convertAndSend("/sub/user-chat/" + senderNickname, chatRoom);
	}
}