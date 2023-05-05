package com.example.memberservice.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.memberservice.common.util.MemberUtil;
import com.example.memberservice.dto.BaseResponseDto;
import com.example.memberservice.dto.MemberDto;
import com.example.memberservice.dto.request.member.MemberInterestsRequestDto;
import com.example.memberservice.service.MemberServiceImpl;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@Validated
@RequestMapping("/auth/members")
public class AuthMemberController {
	private final MemberServiceImpl memberService;

	/**
	 * 김윤미
	 * explain : 사용자 초기 관심사 등록
	 * @param memberInterestsRequestDto
	 * @param request
	 * @return
	 */
	@PostMapping("/interests")
	public ResponseEntity<BaseResponseDto> createMemberInterests(
		@RequestBody MemberInterestsRequestDto memberInterestsRequestDto, HttpServletRequest request) {
		MemberDto memberDto = MemberUtil.getMember(request.getHeader("member"));
		memberService.createInterests(memberInterestsRequestDto, memberDto);
		return ResponseEntity.status(HttpStatus.OK)
			.body(new BaseResponseDto<>(200, "관심사 등록에 성공했습니다."));
	}
}