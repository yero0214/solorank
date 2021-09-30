package com.example.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;

import reactor.core.publisher.Flux;

@RestController
public class Controller {

	@Autowired
    private WebClient webClient;

    @CrossOrigin(origins = "*", allowedHeaders = "*", methods = RequestMethod.GET)
    @GetMapping("/call")
    public Flux<String> call(@RequestParam String uri, @RequestParam String token) {
        return webClient.get()
                .uri(uri)
				.headers(httpHeaders -> {
					httpHeaders.set("X-Riot-Token", token);
				})
                .retrieve()
                .bodyToFlux(String.class);
    }
}
