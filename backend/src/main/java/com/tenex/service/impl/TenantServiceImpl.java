package com.tenex.service.impl;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Map;
import javax.sql.DataSource;

import com.tenex.entity.master.Role;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import com.tenex.entity.master.ERole;
import com.tenex.repository.master.RoleRepository;
import com.tenex.service.TenantService;

@Service
public class TenantServiceImpl implements TenantService {

    private static final Logger logger = LoggerFactory.getLogger(TenantServiceImpl.class);
    private static final Map<String, String> tenants = new HashMap<>();

    @Autowired
    private DataSource dataSource;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private RoleRepository roleRepository;

    @Override
    @Transactional
    public void createTenant(String tenantId, String companyName) {
        try {
            // Create a new schema for the tenant
            jdbcTemplate.execute("CREATE SCHEMA IF NOT EXISTS " + tenantId);

            // Force commit of schema creation before proceeding
            jdbcTemplate.execute("COMMIT");

            logger.info("Schema {} created successfully", tenantId);

            // Store tenant information
            tenants.put(tenantId, companyName);

            // Initialize tenant-specific tables and data in a new transaction
            initializeTenantTablesInNewTransaction(tenantId);

            logger.info("Tenant {} created successfully", tenantId);
        } catch (DataAccessException e) {
            logger.error("Error creating tenant schema {}: {}", tenantId, e.getMessage());
            throw new RuntimeException("Error creating tenant", e);
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void initializeTenantTablesInNewTransaction(String tenantId) {
        try {
            initializeTenantTables(tenantId);
        } catch (Exception e) {
            logger.error("Error initializing tenant tables in new transaction: {}", e.getMessage());
            throw new RuntimeException("Failed to initialize tenant tables in new transaction", e);
        }
    }

    @Override
    public boolean tenantExists(String tenantId) {
        try {
            Integer count = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM information_schema.schemata WHERE schema_name = ?",
                    Integer.class,
                    tenantId);

            return count != null && count > 0;
        } catch (DataAccessException e) {
            logger.error("Error checking if tenant exists: {}", e.getMessage());
            return false;
        }
    }

    private void initializeTenantTables(String tenantId) {
        // Verify schema exists before proceeding
        if (!tenantExists(tenantId)) {
            String errorMsg = "Cannot initialize tables: schema " + tenantId + " does not exist";
            logger.error(errorMsg);
            throw new RuntimeException(errorMsg);
        }

        try (Connection connection = dataSource.getConnection();
                Statement stmt = connection.createStatement()) {

            // Create projects table
            stmt.execute("CREATE TABLE IF NOT EXISTS " + tenantId + ".projects (" +
                    "id SERIAL PRIMARY KEY, " +
                    "tenant_id VARCHAR(255) NOT NULL, " +
                    "name VARCHAR(255) NOT NULL, " +
                    "description TEXT, " +
                    "start_date DATE, " +
                    "end_date DATE, " +
                    "status VARCHAR(50), " +
                    "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
                    "updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP" +
                    ")");

            // Create tasks table
            stmt.execute("CREATE TABLE IF NOT EXISTS " + tenantId + ".tasks (" +
                    "id SERIAL PRIMARY KEY, " +
                    "project_id BIGINT NOT NULL, " +
                    "title VARCHAR(255) NOT NULL, " +
                    "description TEXT, " +
                    "status VARCHAR(50), " +
                    "priority VARCHAR(50), " +
                    "assigned_to BIGINT, " +
                    "created_by BIGINT NOT NULL, " +
                    "estimated_time INT, " +
                    "due_date DATE, " +
                    "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
                    "updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
                    "CONSTRAINT fk_project FOREIGN KEY(project_id) REFERENCES " + tenantId + ".projects(id)" +
                    ")");

            // Create comments table
            stmt.execute("CREATE TABLE IF NOT EXISTS " + tenantId + ".comments (" +
                    "id SERIAL PRIMARY KEY, " +
                    "task_id BIGINT NOT NULL, " +
                    "user_id BIGINT NOT NULL, " +
                    "content TEXT NOT NULL, " +
                    "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
                    "updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
                    "CONSTRAINT fk_task FOREIGN KEY(task_id) REFERENCES " + tenantId + ".tasks(id)" +
                    ")");

            // Create user_project_assignments table (Many-to-Many)
            stmt.execute("CREATE TABLE IF NOT EXISTS " + tenantId + ".user_project_assignments (" +
                    "user_id BIGINT NOT NULL, " +
                    "project_id BIGINT NOT NULL, " +
                    "role_in_project VARCHAR(50), " +
                    "assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
                    "PRIMARY KEY (user_id, project_id), " +
                    "FOREIGN KEY (project_id) REFERENCES " + tenantId + ".projects(id)" +
                    ")");

            // Create attachments table
            stmt.execute("CREATE TABLE IF NOT EXISTS " + tenantId + ".attachments (" +
                    "id SERIAL PRIMARY KEY, " +
                    "task_id BIGINT, " +
                    "comment_id BIGINT, " +
                    "file_name VARCHAR(255), " +
                    "file_type VARCHAR(100), " +
                    "file_url TEXT, " +
                    "uploaded_by BIGINT NOT NULL, " +
                    "file_size BIGINT, " +
                    "uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP" +
                    ")");

            // Create activity_logs table
            stmt.execute("CREATE TABLE IF NOT EXISTS " + tenantId + ".activity_logs (" +
                    "id SERIAL PRIMARY KEY, " +
                    "user_id BIGINT NOT NULL, " +
                    "action VARCHAR(255) NOT NULL, " +
                    "entity_type VARCHAR(100), " +
                    "entity_id BIGINT, " +
                    "timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP" +
                    ")");

            // Create task_status_history table
            stmt.execute("CREATE TABLE IF NOT EXISTS " + tenantId + ".task_status_history (" +
                    "id SERIAL PRIMARY KEY, " +
                    "task_id BIGINT NOT NULL, " +
                    "old_status VARCHAR(50), " +
                    "new_status VARCHAR(50), " +
                    "changed_by BIGINT NOT NULL, " +
                    "changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
                    "FOREIGN KEY (task_id) REFERENCES " + tenantId + ".tasks(id)" +
                    ")");

            // Create task_checklists table
            stmt.execute("CREATE TABLE IF NOT EXISTS " + tenantId + ".task_checklists (" +
                    "id SERIAL PRIMARY KEY, " +
                    "task_id BIGINT NOT NULL, " +
                    "item TEXT NOT NULL, " +
                    "completed BOOLEAN DEFAULT FALSE, " +
                    "FOREIGN KEY (task_id) REFERENCES " + tenantId + ".tasks(id)" +
                    ")");

            // Create user_task_assignments table (Many-to-Many)
            stmt.execute("CREATE TABLE IF NOT EXISTS " + tenantId + ".user_task_assignments (" +
                    "user_id BIGINT NOT NULL, " +
                    "task_id BIGINT NOT NULL, " +
                    "assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
                    "PRIMARY KEY (user_id, task_id), " +
                    "FOREIGN KEY (task_id) REFERENCES " + tenantId + ".tasks(id)" +
                    ")");

            // Create project_milestones table
            stmt.execute("CREATE TABLE IF NOT EXISTS " + tenantId + ".project_milestones (" +
                    "id SERIAL PRIMARY KEY, " +
                    "project_id BIGINT NOT NULL, " +
                    "title VARCHAR(255) NOT NULL, " +
                    "description TEXT, " +
                    "due_date DATE, " +
                    "completed BOOLEAN DEFAULT FALSE, " +
                    "FOREIGN KEY (project_id) REFERENCES " + tenantId + ".projects(id)" +
                    ")");

        } catch (SQLException e) {
            logger.error("Error initializing tenant tables: {}", e.getMessage());
            throw new RuntimeException("Failed to initialize tenant tables", e);
        }
    }

    @Override
    @Transactional
    public void initializeDefaultRoles() {
        try {
            // Create default roles if they don't exist
            for (ERole roleEnum : ERole.values()) {
                if (!roleRepository.findByName(roleEnum).isPresent()) {
                    Role role = new Role();
                    role.setName(roleEnum);
                    roleRepository.save(role);
                    logger.info("Created role: {}", roleEnum);
                }
            }
        } catch (Exception e) {
            logger.error("Error initializing default roles: {}", e.getMessage());
            throw new RuntimeException("Failed to initialize default roles", e);
        }
    }
}