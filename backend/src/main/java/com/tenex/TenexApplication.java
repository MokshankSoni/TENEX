package com.tenex;

import com.tenex.config.multitenancy.TenantContext;
import com.tenex.service.TenantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
public class TenexApplication {

	@Autowired
	private TenantService tenantService;

	public static void main(String[] args) {
		SpringApplication.run(TenexApplication.class, args);
	}

	@EventListener
	public void onApplicationEvent(ContextRefreshedEvent event) {
		TenantContext.setCurrentTenant("public");

		tenantService.initializeDefaultRoles();

		if (!tenantService.tenantExists("master")) {
			tenantService.createTenant("master", "System Administrator");
		}
	}
}
