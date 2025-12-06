package com.example.back.service;

import com.example.back.DTO.BookCreateRequest;
import com.example.back.DTO.BookCreateResponse;
import com.example.back.DTO.BookListResponse;
import com.example.back.entity.Book;
import com.example.back.entity.Category;
import com.example.back.entity.User;
import com.example.back.jwt.JwtUtil;
import com.example.back.repository.BookRepository;
import com.example.back.repository.CategoryRepository;
import com.example.back.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


@Service
@Slf4j
@RequiredArgsConstructor
public class BookService {
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private JwtUtil jwtUtil;

    // 도서 목록 조회 (GET)
    public BookListResponse getBooks(int page, int size) {
        /**
         * 도서 목록 조회 서비스 로직
         *
         * - 전달받은 page, size 값을 기반으로 Pageable 객체를 생성하여 페이징 처리된 도서 목록을 조회한다.
         * - JPA의 findAll(Pageable)을 사용하여 전체 도서 목록을 페이지 단위로 조회한다.
         * - 조회된 Page<Book> 객체를 BookListResponse DTO 형태로 변환하여 반환한다.
         *
         * @param page int
         *     - 조회할 페이지 번호 (0부터 시작)
         * @param size int
         *     - 한 페이지에 조회할 도서 개수
         *
         * @return BookListResponse
         *     - 현재 페이지 번호 (page)
         *     - 전체 페이지 수 (totalPages)
         *     - 도서 목록 리스트 (books)
         */
        Pageable pageable = PageRequest.of(page, size);
        Page<Book> result = bookRepository.findAll(pageable);

        // Page<Book> -> BookListResponse 로 변환
        return BookListResponse.from(result);
    }

    // TODO: 도서 상세 정보 조회 (GET)


    // TODO: 신규 도서 등록 (POST)
    public BookCreateResponse createBook(String userId, BookCreateRequest req) {
        /**
         * 도서 등록 서비스 로직
         *
         * <동작 개요>
         * - JWT 인증을 통해 전달된 userId와 클라이언트가 보낸 도서 정보를 바탕으로
         *   새로운 Book 엔티티를 생성하고 DB에 저장한 뒤, 생성된 도서의 PK(bookId)만 반환한다.
         *
         * @param userId JwtAuthFilter에서 추출된 인증 사용자 ID (users.id)
         * @param req    도서 등록 요청 본문 데이터 (title, description, content, categoryId)
         *
         * @return BookCreateResponse
         *     - 생성된 도서의 PK 값(bookId)을 담은 응답 DTO
         *
         * @throws IllegalArgumentException
         *     - 제목/설명/내용 등 필수 값이 비어 있거나 잘못된 경우
         *
         * @throws RuntimeException
         *     - userId에 해당하는 사용자 정보를 찾지 못한 경우
         *     - categoryId에 해당하는 카테고리 정보를 찾지 못한 경우
         */
        log.info("도서 등록 서비스 시작: userId={}, title={}", userId, req.getTitle());

        // 1) 필수 값 검증
        if (req.getTitle() == null || req.getTitle().isBlank()
                || req.getDescription() == null || req.getDescription().isBlank()
                || req.getContent() == null || req.getContent().isBlank()) {
            log.warn("도서 등록 실패 - 잘못된 요청 데이터: title/description/content 비어 있음");
            throw new IllegalArgumentException("도서 정보가 올바르지 않습니다.");
        }

        // 2) 사용자 조회 (존재 여부 확인)
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.warn("도서 등록 실패 - 사용자 조회 실패: userId={}", userId);
                    return new RuntimeException("사용자 정보를 찾을 수 없습니다.");
                });

        // 3) 카테고리 조회
        Category category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> {
                    log.warn("도서 등록 실패 - 카테고리 조회 실패: categoryId={}", req.getCategoryId());
                    return new RuntimeException("카테고리 정보를 찾을 수 없습니다.");
                });

        // 4) Book 엔티티 생성
        Book book = new Book();
        book.setUser(user);
        book.setCategory(category);
        book.setTitle(req.getTitle());
        book.setDescription(req.getDescription());
        book.setContent(req.getContent());

        // 5) 저장
        Book saved = bookRepository.save(book);
        log.info("도서 등록 서비스 완료: bookId={}", saved.getId());

        // 6) bookId만 반환
        return new BookCreateResponse(saved.getId());
    }

    // TODO: 도서 수정 (PUT)


    // TODO: 도서 삭제 (DELETE)

}
