package com.example.memberservice.dto.request.member;

import com.example.memberservice.common.annotation.AuthCode;
import com.example.memberservice.common.annotation.Email;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class CheckEmailCodeRequestDto {
	@Email
	private String email;

	@AuthCode
	private String authCode;
}
