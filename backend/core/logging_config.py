import logging
import sys
import structlog


def setup_logging():
    # 공유 프로세서: 모든 로그 레코드에 공통적으로 적용될 처리 단계
    shared_processors = [
        # 특별히 부여된 ID 같은 게 있나?" 하고 주변 컨텍스트를 살핍
        structlog.contextvars.merge_contextvars,
        # 로그 레벨 정보를 추가
        structlog.stdlib.add_log_level,
        # 현재 시간을 찍어주는 역할
        structlog.processors.TimeStamper(fmt="iso"),
    ]
    # structlog 설정
    structlog.configure(
        processors=shared_processors
        + [
            # structlog의 내부 로그 메시지를 표준 라이브러리 형식으로 변환
            structlog.stdlib.ProcessorFormatter.wrap_for_formatter
        ],
        # 로거 팩토리: 표준 로깅과의 호환성 설정
        logger_factory=structlog.stdlib.LoggerFactory(),
        # 래퍼 클래스: 표준 로거를 감싸는 클래스
        wrapper_class=structlog.stdlib.BoundLogger,
        # 캐시 설정: 성능 향상을 위해 로거 인스턴스 캐시
        cache_logger_on_first_use=True,
    )
    # 표준 로깅 핸들러 설정
    handler = logging.StreamHandler(sys.stdout)
    # 포매터 설정: 최종 로그 출력을 JSON으로 렌더링
    formatter = structlog.stdlib.ProcessorFormatter(
        processor=structlog.processors.JSONRenderer(),
        foreign_pre_chain=shared_processors,
    )
    handler.setFormatter(formatter)

    root_logger = logging.getLogger()
    root_logger.handlers.clear()
    root_logger.addHandler(handler)
    root_logger.setLevel(logging.INFO)
