<img src="http://www.licky.co/images/logoTitle.png"/>

# Licky Mobile App
현재 서비스 되고 있는 먹짤 앱 Licky(http://licky.co) 아이폰 앱 프로젝트입니다. 누구나 MIT License에 따라 자유롭게 이용가능합니다.  
(현재 Licky는 대한민국 Apple App Store에서 다운가능합니다. 다른 국가도 곧 오픈 예정)

## 열려있습니다. 환영합니다.
기능 제안이나 Pull Request 모두 환영합니다.
- 제안 및 버그 신고는 http://sup.licky.co 고객지원 사이트를 이용해주세요.
- Pull Request는 Github의 Pull Request 통해서 해주세요.

## 개발 환경
- App : [Titanium Mobile Platform](http://www.appcelerator.com/titanium/)
- Backend Server(API Server) : [Appclerator Cloud Service(ACS)](http://docs.appcelerator.com/cloud/latest/)
- Web Server : [Node.ACS](http://docs.appcelerator.com/cloud/latest/)

## 실행방법
`tiapp.xml`과 `manifest` 파일은 보안상 소스파일에 포함되어 있지 않습니다. 프로젝트 실행을 위해서는 다음 안내사항을 따르세요.
1. `tiapp.sample.xml` 파일을 `tiapp.xml`로 이름을 변경
2. `tiapp.xml`을 열어 `***REMOVED***`라고 되어 있는 부분을 당신의 환경에 맞게 수정하세요.
		...
		<property name="acs-oauth-secret-development" type="string">***REMOVED***</property>
    	<property name="acs-oauth-key-development" type="string">***REMOVED***</property>
    	<property name="acs-api-key-development" type="string">***REMOVED***</property>
    	...
    * 위 내용은 titanium studio나 ti cli를 통해 프로젝트를 생성하고 acs를 활성하한후 생성된 tiapp.xml의 내용을 참고하세요.
    * Facebook APP ID는 http://developers.facebook.com 에서 app생성 가능합니다.
3. `manifest.sample` 파일을 `manifest`로 이름을 변경
4. `manifest`를 열어 appid 및 guid등을 변경

## TODO
- 본 프로젝트는 iPhone 앱에 해당하는 내용이며 ACS관련 소스는 공개 예정에 있습니다.

## MIT License
The MIT License (MIT)
[OSI Approved License]
The MIT License (MIT)

Copyright (c) <year> <copyright holders>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
