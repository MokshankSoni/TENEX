package com.tenex;

import com.tenex.config.multitenancy.TenantContext;
import com.tenex.service.TenantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;

@SpringBootApplication
public class TenexApplication {

	@Autowired
	private TenantService tenantService;

	public static void main(String[] args) {
		SpringApplication.run(TenexApplication.class, args);
	}

	@EventListener
	public void onApplicationEvent(ContextRefreshedEvent event)
	{
		TenantContext.setCurrentTenant("public");

		tenantService.initializeDefaultRoles();

		if(!tenantService.tenantExists("master"))
		{
			tenantService.createTenant("master","System Administrator");
		}
	}

}
