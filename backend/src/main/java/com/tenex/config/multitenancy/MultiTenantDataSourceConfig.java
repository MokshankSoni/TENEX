package com.tenex.config.multitenancy;

import com.tenex.config.multitenancy.SchemaMultiTenantConnectionProvider;
import com.tenex.config.multitenancy.TenantIdentifierResolver;
import org.hibernate.context.spi.CurrentTenantIdentifierResolver;
import org.hibernate.engine.jdbc.connections.spi.MultiTenantConnectionProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.orm.jpa.JpaProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;

import jakarta.persistence.EntityManagerFactory;
import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableJpaRepositories(
        basePackages = "com.tenex.repository.master",
        entityManagerFactoryRef = "entityManagerFactory",
        transactionManagerRef = "transactionManager"
)


public class MultiTenantDataSourceConfig {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private JpaProperties jpaProperties;

    @Autowired
    private SchemaMultiTenantConnectionProvider multiTenantConnectionProvider;

    @Autowired
    private TenantIdentifierResolver tenantIdentifierResolver;

    @Value("${spring.jpa.properties.hibernate.dialect}")
    private String hibernateDialect;

    @Bean
    @Primary
    public LocalContainerEntityManagerFactoryBean entityManagerFactory() {
        LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
        em.setDataSource(dataSource);

        // Scan only master entities first
        em.setPackagesToScan("com.tenex.entity.master");

        HibernateJpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
        em.setJpaVendorAdapter(vendorAdapter);

        Map<String, Object> properties = new HashMap<>(jpaProperties.getProperties());
        properties.put("hibernate.multiTenancy", "SCHEMA");
        properties.put("hibernate.tenant_connection_provider", multiTenantConnectionProvider);
        properties.put("hibernate.tenant_identifier_resolver", tenantIdentifierResolver);
        properties.put("hibernate.dialect", hibernateDialect);
        //properties.put("hibernate.dialect", "org.hibernate.dialect.PostgreSQLDialect");
        properties.put("hibernate.show_sql", true);
        properties.put("hibernate.format_sql", true);
        properties.put("hibernate.hbm2ddl.auto", "update");

        // Force master entities to use public schema
        properties.put("hibernate.physical_naming_strategy",
                "com.tenex.config.multitenancy.MasterSchemaNamingStrategy");

        em.setJpaPropertyMap(properties);
        return em;
    }

    @Bean
    @Primary
    public JpaTransactionManager transactionManager(EntityManagerFactory entityManagerFactory) {
        JpaTransactionManager transactionManager = new JpaTransactionManager();
        transactionManager.setEntityManagerFactory(entityManagerFactory);
        return transactionManager;
    }
}
